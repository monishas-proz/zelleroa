import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { cartService } from "@/features/cart/services/cart.service";
import { resolveCartIdentity, attachGuestCartCookie } from "@/lib/cart/guest-session";
import {
  updateCartItemSchema,
  type UpdateCartItemInput,
} from "@/features/cart/validations/cart.schema";

export const GET = createApiHandler(
  {
    GET: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);

      const variantUuid = context.params?.variantUuid;
      if (!variantUuid) {
        throw ApiError.badRequest("variantUuid is required");
      }

      const item = await cartService.getCartItem(identity, variantUuid);

      const response = apiSuccess(item, "Cart item fetched successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
  }
);

export const PUT = createApiHandler(
  {
    PUT: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);

      const variantUuid = context.params?.variantUuid;
      if (!variantUuid) {
        throw ApiError.badRequest("variantUuid is required");
      }

      const body = context.body as UpdateCartItemInput;
      const cart = await cartService.updateItemQuantity(
        identity,
        variantUuid,
        body
      );

      const response = apiSuccess(cart, "Cart item updated successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
    bodySchema: updateCartItemSchema,
  }
);

export const DELETE = createApiHandler(
  {
    DELETE: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);

      const variantUuid = context.params?.variantUuid;
      if (!variantUuid) {
        throw ApiError.badRequest("variantUuid is required");
      }

      const cart = await cartService.removeItem(identity, variantUuid);

      const response = apiSuccess(cart, "Cart item removed successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
  }
);
