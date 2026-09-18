import { NextRequest, NextResponse } from "next/server";

export const REFERRAL_AGENT_COOKIE = "referral_agent";
const REFERRAL_AGENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Captures `?ref=<referral_code>` off the request URL into the
 * `referral_agent` cookie (last-click wins), if present. Called from
 * middleware on every page so the cookie survives to signup/checkout
 * regardless of the landing page.
 *
 * Kept dependency-free (no Prisma) so it stays safe to import from the
 * Edge middleware bundle.
 */
export function captureReferralCookie<T>(
  request: NextRequest,
  response: NextResponse<T>
): NextResponse<T> {
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    response.cookies.set(REFERRAL_AGENT_COOKIE, ref, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
      path: "/",
      maxAge: REFERRAL_AGENT_COOKIE_MAX_AGE,
    });
  }
  return response;
}
