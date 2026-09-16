import { ApiError } from "@/lib/api/api-error";
import { reservationRepository } from "../repositories/reservation.repository";
import type { Prisma } from "@/generated/prisma";

const RESERVATION_TTL_MS = 30 * 60 * 1000; // 30 minutes

type Tx = Prisma.TransactionClient;

export const reservationService = {
  /**
   * Holds `quantity` of this item for this cart, rejecting if that exceeds
   * what's left after every other cart's active hold. Pass quantity 0 to
   * drop this cart's hold instead (e.g. item removed). Must run inside the
   * same transaction as the cart mutation it's guarding.
   */
  async checkAndReserve(
    tx: Tx,
    params: { variantUnitPriceId: bigint; cartId: bigint; quantity: number; itemLabel?: string }
  ): Promise<void> {
    await reservationRepository.releaseExpired(tx, params.variantUnitPriceId);

    if (params.quantity <= 0) {
      await reservationRepository.releaseForCartItem(tx, params);
      await reservationRepository.syncInventoryReservedCount(tx, params.variantUnitPriceId);
      return;
    }

    const [inventory, otherReserved] = await Promise.all([
      tx.inventory.findUnique({
        where: { variantUnitPriceId: params.variantUnitPriceId },
        select: { quantity_available: true },
      }),
      reservationRepository.sumActiveReserved(tx, params.variantUnitPriceId, params.cartId),
    ]);

    const totalStock = inventory?.quantity_available ?? 0;
    const availableForThisCart = totalStock - otherReserved;

    if (params.quantity > availableForThisCart) {
      throw ApiError.badRequest(
        `Only ${Math.max(0, availableForThisCart)} left in stock${
          params.itemLabel ? ` for "${params.itemLabel}"` : ""
        }`
      );
    }

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);
    await reservationRepository.upsertForCart(tx, { ...params, expiresAt });
    await reservationRepository.syncInventoryReservedCount(tx, params.variantUnitPriceId);
  },

  /** Drops every hold this cart has - e.g. the cart was cleared. */
  async releaseCart(tx: Tx, cartId: bigint): Promise<void> {
    const affectedItems = await reservationRepository.releaseAllForCart(tx, cartId);
    for (const variantUnitPriceId of affectedItems) {
      // eslint-disable-next-line no-await-in-loop
      await reservationRepository.syncInventoryReservedCount(tx, variantUnitPriceId);
    }
  },

  /** Converts this cart's holds into confirmed holds against the placed order. */
  async confirmCart(tx: Tx, cartId: bigint, orderId: bigint): Promise<void> {
    const affectedItems = await reservationRepository.confirmForCart(tx, cartId, orderId);
    for (const variantUnitPriceId of affectedItems) {
      // eslint-disable-next-line no-await-in-loop
      await reservationRepository.syncInventoryReservedCount(tx, variantUnitPriceId);
    }
  },
};
