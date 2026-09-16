import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { cartService } from "@/features/cart/services/cart.service";
import { resolveCartIdentity, attachGuestCartCookie } from "@/lib/cart/guest-session";
import {
  addCartItemSchema,
  type AddCartItemInput,
} from "@/features/cart/validations/cart.schema";

export const POST = createApiHandler(
  {
    POST: async (request, context) => {
      const { identity, guestCookie } = resolveCartIdentity(request, context);

      const body = context.body as AddCartItemInput;
      const cart = await cartService.addItem(identity, body);

      const response = apiSuccess(cart, "Item added to cart successfully", 200);
      return guestCookie?.isNew ? attachGuestCartCookie(response, guestCookie.id) : response;
    },
  },
  {
    optionalAuth: true,
    bodySchema: addCartItemSchema,
  }
);
