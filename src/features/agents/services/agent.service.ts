import crypto from "crypto";
import { ApiError } from "@/lib/api/api-error";
import { APP_URL } from "@/lib/constants";
import { agentRepository } from "../repositories/agent.repository";
import type {
  AgentAttributedOrder,
  AgentDashboardSummary,
  AgentReferredUser,
  PaginatedResult,
} from "../types";

function generateReferralCode(name: string): string {
  const prefix = (name || "AGT").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "AGT";
  return `${prefix}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export const agentService = {
  /** Every agent gets a shareable code lazily, the first time it's needed. */
  async getOrCreateReferralCode(agentUserId: bigint): Promise<string> {
    const agent = await agentRepository.findAgentById(agentUserId);
    if (!agent) {
      throw ApiError.notFound("Agent not found");
    }
    if (agent.referral_code) {
      return agent.referral_code;
    }

    // referral_code is unique - retry a couple of times on the unlikely collision.
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateReferralCode(agent.name);
      try {
        await agentRepository.setReferralCode(agentUserId, code);
        return code;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError instanceof Error ? lastError : ApiError.internal("Could not generate referral code");
  },

  async getDashboardSummary(agentUserId: bigint): Promise<AgentDashboardSummary> {
    const [referralCode, totalReferredUsers, totalAttributedOrders, totalAttributedOrderValue] =
      await Promise.all([
        this.getOrCreateReferralCode(agentUserId),
        agentRepository.countReferredUsers(agentUserId),
        agentRepository.countAttributedOrders(agentUserId),
        agentRepository.sumAttributedOrderValue(agentUserId),
      ]);

    return {
      referralCode,
      referralLink: `${APP_URL}/?ref=${referralCode}`,
      totalReferredUsers,
      totalAttributedOrders,
      totalAttributedOrderValue,
    };
  },

  async getReferredUsers(
    agentUserId: bigint,
    page = 1,
    limit = 20
  ): Promise<PaginatedResult<AgentReferredUser>> {
    const [rows, total] = await Promise.all([
      agentRepository.listReferredUsers(agentUserId, page, limit),
      agentRepository.countReferredUsers(agentUserId),
    ]);

    return {
      data: rows.map((u) => ({
        id: u.uuid ?? "",
        name: u.name,
        email: u.email,
        referredAt: u.referred_at ? u.referred_at.toISOString() : null,
      })),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },

  async getAttributedOrders(
    agentUserId: bigint,
    page = 1,
    limit = 20
  ): Promise<PaginatedResult<AgentAttributedOrder>> {
    const [rows, total] = await Promise.all([
      agentRepository.listAttributedOrders(agentUserId, page, limit),
      agentRepository.countAttributedOrders(agentUserId),
    ]);

    return {
      data: rows.map((o) => ({
        id: o.uuid ?? "",
        orderNumber: o.orderNumber,
        customerName: o.user?.name ?? "",
        totalAmount: Number(o.totalAmount),
        orderStatus: o.order_status,
        paymentStatus: o.payment_status,
        createdAt: o.createdAt.toISOString(),
      })),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },
};
