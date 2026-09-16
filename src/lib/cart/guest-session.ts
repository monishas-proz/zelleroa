import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { HandlerContext } from "@/lib/api/api-handler";
import type { CartIdentity } from "@/features/cart/services/cart.service";

export const GUEST_CART_COOKIE = "guest_cart_id";

const IS_PROD = process.env.NODE_ENV === "production";

/** Reads the guest cart cookie, or mints a fresh id if none is set yet. */
export function getOrCreateGuestCartId(request: NextRequest): {
  id: string;
  isNew: boolean;
} {
  const existing = request.cookies.get(GUEST_CART_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: crypto.randomUUID(), isNew: true };
}

export function attachGuestCartCookie<T>(
  response: NextResponse<T>,
  id: string
): NextResponse<T> {
  response.cookies.set(GUEST_CART_COOKIE, id, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}

/**
 * Resolves who is calling a cart endpoint (`optionalAuth` route): a logged-in
 * customer's session, or an anonymous guest identified by a cookie. When the
 * caller is a fresh guest, a cookie must still be minted — `guestCookie.isNew`
 * tells the route to attach it to the response via `attachGuestCartCookie`.
 */
export function resolveCartIdentity(
  request: NextRequest,
  context: HandlerContext
): { identity: CartIdentity; guestCookie: { id: string; isNew: boolean } | null } {
  const sessionUserId = context.session?.user?.id;
  if (sessionUserId) {
    return { identity: { sessionUserId }, guestCookie: null };
  }

  const guestCookie = getOrCreateGuestCartId(request);
  return { identity: { guestSessionId: guestCookie.id }, guestCookie };
}

export function clearGuestCartCookie<T>(response: NextResponse<T>): NextResponse<T> {
  response.cookies.set(GUEST_CART_COOKIE, "", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
