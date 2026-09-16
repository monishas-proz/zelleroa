import { cookies } from "next/headers";
import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { orderService } from "@/features/orders/services/order.service";
import {
  guestCreateOrderSchema,
  type GuestCreateOrderInput,
} from "@/features/orders/validations/order.schema";
import { GUEST_CART_COOKIE, clearGuestCartCookie } from "@/lib/cart/guest-session";

const IS_PROD = process.env.NODE_ENV === "production";

export const POST = createApiHandler(
  {
    POST: async (request, context) => {
      const body = context.body as GuestCreateOrderInput;
      const guestSessionId = request.cookies.get(GUEST_CART_COOKIE)?.value ?? null;

      const { order, accessToken, refreshToken } = await orderService.createGuestOrder(
        body,
        guestSessionId
      );

      const cookieStore = await cookies();
      cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      const response = apiSuccess(order, "Order placed successfully", 201);
      return clearGuestCartCookie(response);
    },
  },
  {
    bodySchema: guestCreateOrderSchema,
    rateLimit: { limit: 10, windowMs: 60_000 },
  }
);
