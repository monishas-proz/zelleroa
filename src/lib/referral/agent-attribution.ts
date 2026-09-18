import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { REFERRAL_AGENT_COOKIE } from "@/lib/referral/cookie";

export { REFERRAL_AGENT_COOKIE, captureReferralCookie } from "@/lib/referral/cookie";

/**
 * Resolves which agent (users.id) should be credited, in priority order:
 * a) the `referral_agent` cookie, if it names a real, active AGENT user
 * b) `fallbackAgentId` (e.g. the user's own `referred_by_agent_id` from signup)
 * c) null
 *
 * Cookie value is untrusted user input (it round-trips a query param), so
 * it's always resolved against the users table rather than trusted as-is.
 */
export async function getAttributingAgent(
  request: NextRequest,
  fallbackAgentId?: bigint | number | string | null
): Promise<bigint | null> {
  const referralCode = request.cookies.get(REFERRAL_AGENT_COOKIE)?.value;

  if (referralCode) {
    const agent = await db.user.findFirst({
      where: {
        referral_code: referralCode,
        is_active: true,
        role: { slug: "agent" },
      },
      select: { id: true },
    });
    if (agent) return agent.id;
  }

  if (fallbackAgentId != null) return BigInt(fallbackAgentId);
  return null;
}
