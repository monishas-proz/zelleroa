import { ApiError } from "@/lib/api/api-error";
import { couponRepository } from "../repositories/coupon.repository";

export interface CouponCartLine {
  productId: bigint;
  categoryId: bigint | null;
  unitPrice: number;
  quantity: number;
}

export interface CouponValidationResult {
  couponId: bigint;
  code: string;
  discountAmount: number;
  eligibleSubtotal: number;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export const couponValidationService = {
  /**
   * Validates a coupon code against the cart and computes the discount it earns.
   * Throws ApiError.badRequest with a customer-facing reason on any failure -
   * never silently returns a zero discount, so the caller can't apply a coupon
   * that didn't actually pass its own rules.
   */
  async validate(
    code: string,
    userId: bigint,
    lines: CouponCartLine[]
  ): Promise<CouponValidationResult> {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      throw ApiError.badRequest("Coupon code is required");
    }

    const coupon = await couponRepository.findActiveByCodeForValidation(normalizedCode);
    if (!coupon) {
      throw ApiError.badRequest("Invalid or inactive coupon code");
    }

    const now = new Date();
    if (coupon.valid_from && now < coupon.valid_from) {
      throw ApiError.badRequest("This coupon is not active yet");
    }
    if (coupon.valid_to && now > coupon.valid_to) {
      throw ApiError.badRequest("This coupon has expired");
    }

    if (coupon.usageLimit !== null) {
      const totalUsed = await couponRepository.countUsage(coupon.id);
      if (totalUsed >= coupon.usageLimit) {
        throw ApiError.badRequest("This coupon has reached its usage limit");
      }
    }

    if (coupon.usage_limit_per_user !== null) {
      const usedByUser = await couponRepository.countUsageForUser(coupon.id, userId);
      if (usedByUser >= coupon.usage_limit_per_user) {
        throw ApiError.badRequest("You have already used this coupon the maximum number of times");
      }
    }

    // Restrict to matching lines when the coupon is scoped to specific
    // categories/products; an unrestricted coupon applies to the whole cart.
    const categoryIds = new Set(coupon.coupon_categories.map((c) => c.category_id.toString()));
    const productIds = new Set(coupon.coupon_products.map((p) => p.product_id.toString()));
    const hasRestrictions = categoryIds.size > 0 || productIds.size > 0;

    const eligibleLines = hasRestrictions
      ? lines.filter(
          (line) =>
            productIds.has(line.productId.toString()) ||
            (line.categoryId && categoryIds.has(line.categoryId.toString()))
        )
      : lines;

    const eligibleSubtotal = roundMoney(
      eligibleLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
    );

    if (hasRestrictions && eligibleSubtotal <= 0) {
      throw ApiError.badRequest("This coupon does not apply to any items in your cart");
    }

    const fullSubtotal = roundMoney(
      lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
    );
    const minOrderAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
    if (minOrderAmount > 0 && fullSubtotal < minOrderAmount) {
      throw ApiError.badRequest(
        `This coupon requires a minimum order of ₹${minOrderAmount} (add ₹${roundMoney(
          minOrderAmount - fullSubtotal
        )} more)`
      );
    }

    let discountAmount =
      coupon.type === "percentage"
        ? (eligibleSubtotal * Number(coupon.value)) / 100
        : Number(coupon.value);

    if (coupon.max_discount_amount !== null) {
      discountAmount = Math.min(discountAmount, Number(coupon.max_discount_amount));
    }
    // A coupon can never discount more than the eligible items actually cost.
    discountAmount = roundMoney(Math.min(discountAmount, eligibleSubtotal));

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      eligibleSubtotal,
    };
  },
};
