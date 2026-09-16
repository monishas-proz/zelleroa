import type { Prisma } from "@/generated/prisma";

type Tx = Prisma.TransactionClient;

export const reservationRepository = {
  /** Expires any reservations for this item whose hold has run out. */
  async releaseExpired(tx: Tx, variantUnitPriceId: bigint) {
    await tx.inventory_reservations.updateMany({
      where: {
        variant_unit_price_id: variantUnitPriceId,
        status: "active",
        expires_at: { lt: new Date() },
      },
      data: { status: "expired" },
    });
  },

  /** Total actively-held quantity for an item, optionally excluding one cart's own hold. */
  async sumActiveReserved(
    tx: Tx,
    variantUnitPriceId: bigint,
    excludeCartId?: bigint
  ): Promise<number> {
    const rows = await tx.inventory_reservations.findMany({
      where: {
        variant_unit_price_id: variantUnitPriceId,
        status: "active",
        expires_at: { gt: new Date() },
        ...(excludeCartId ? { cart_id: { not: excludeCartId } } : {}),
      },
      select: { quantity: true },
    });
    return rows.reduce((sum, r) => sum + r.quantity, 0);
  },

  /** Replaces this cart's hold on this item with the given quantity. */
  async upsertForCart(
    tx: Tx,
    params: { variantUnitPriceId: bigint; cartId: bigint; quantity: number; expiresAt: Date }
  ) {
    const existing = await tx.inventory_reservations.findFirst({
      where: {
        variant_unit_price_id: params.variantUnitPriceId,
        cart_id: params.cartId,
        status: "active",
      },
    });

    if (existing) {
      await tx.inventory_reservations.update({
        where: { id: existing.id },
        data: { quantity: params.quantity, expires_at: params.expiresAt },
      });
    } else {
      await tx.inventory_reservations.create({
        data: {
          variant_unit_price_id: params.variantUnitPriceId,
          cart_id: params.cartId,
          quantity: params.quantity,
          expires_at: params.expiresAt,
          status: "active",
        },
      });
    }
  },

  /** Drops this cart's hold on this item (item removed, or quantity set to 0). */
  async releaseForCartItem(
    tx: Tx,
    params: { variantUnitPriceId: bigint; cartId: bigint }
  ) {
    await tx.inventory_reservations.updateMany({
      where: {
        variant_unit_price_id: params.variantUnitPriceId,
        cart_id: params.cartId,
        status: "active",
      },
      data: { status: "released" },
    });
  },

  /** Drops every active hold this cart has (cart cleared, or checked out). */
  async releaseAllForCart(tx: Tx, cartId: bigint): Promise<bigint[]> {
    const rows = await tx.inventory_reservations.findMany({
      where: { cart_id: cartId, status: "active" },
      select: { variant_unit_price_id: true },
    });
    await tx.inventory_reservations.updateMany({
      where: { cart_id: cartId, status: "active" },
      data: { status: "released" },
    });
    return rows.map((r) => r.variant_unit_price_id);
  },

  /** Converts this cart's active holds into confirmed holds against the placed order. */
  async confirmForCart(tx: Tx, cartId: bigint, orderId: bigint): Promise<bigint[]> {
    const rows = await tx.inventory_reservations.findMany({
      where: { cart_id: cartId, status: "active" },
      select: { variant_unit_price_id: true },
    });
    await tx.inventory_reservations.updateMany({
      where: { cart_id: cartId, status: "active" },
      data: { status: "confirmed", order_id: orderId },
    });
    return rows.map((r) => r.variant_unit_price_id);
  },

  /** Recomputes Inventory.quantity_reserved from the current active holds - never incremented/decremented directly, to avoid drift. */
  async syncInventoryReservedCount(tx: Tx, variantUnitPriceId: bigint) {
    const total = await this.sumActiveReserved(tx, variantUnitPriceId);
    await tx.inventory.updateMany({
      where: { variantUnitPriceId },
      data: { quantity_reserved: total },
    });
  },
};
