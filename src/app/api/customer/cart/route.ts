import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { cartService } from "@/features/cart/services/cart.service";
import { resolveCartIdentity, attachGuestCartCookie } from "@/lib/cart/guest-session";

export const GET = createApiHandler(
  {
    GET: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);
      const cart = await cartService.getCart(identity);

      const response = apiSuccess(cart, "Cart fetched successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
  }
);

export const DELETE = createApiHandler(
  {
    DELETE: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);
      await cartService.clearCart(identity);

      const response = apiSuccess(null, "Cart cleared successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
  }
);
