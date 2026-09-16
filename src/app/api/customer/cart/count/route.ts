import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { cartService } from "@/features/cart/services/cart.service";
import { resolveCartIdentity, attachGuestCartCookie } from "@/lib/cart/guest-session";

export const GET = createApiHandler(
  {
    GET: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);
      const result = await cartService.getCartCount(identity);

      const response = apiSuccess(result, "Cart count fetched successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
  }
);
