import Link from "next/link";
import { Users, ShoppingBag, IndianRupee } from "lucide-react";
import { requireAgent } from "@/lib/auth/require-auth";
import { userRepository } from "@/features/users/repositories/user.repository";
import { agentService } from "@/features/agents/services/agent.service";
import { ReferralLinkCard } from "@/features/agents/components/ReferralLinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDateTime } from "@/lib/utils";

const PAGE_SIZE = 20;

interface AgentDashboardPageProps {
  searchParams: Promise<{ refPage?: string; ordPage?: string }>;
}

export default async function AgentDashboardPage({ searchParams }: AgentDashboardPageProps) {
  const session = await requireAgent();
  const params = await searchParams;

  const user = await userRepository.findById(session.user.id);
  if (!user || !user.internalId) {
    throw new Error("Agent account could not be resolved");
  }
  const agentId = BigInt(user.internalId);

  const refPage = Math.max(1, Number(params.refPage) || 1);
  const ordPage = Math.max(1, Number(params.ordPage) || 1);

  const [summary, referrals, orders] = await Promise.all([
    agentService.getDashboardSummary(agentId),
    agentService.getReferredUsers(agentId, refPage, PAGE_SIZE),
    agentService.getAttributedOrders(agentId, ordPage, PAGE_SIZE),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <ReferralLinkCard referralCode={summary.referralCode} referralLink={summary.referralLink} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referred signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalReferredUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attributed orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalAttributedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attributed order value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(summary.totalAttributedOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referred signups</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No one has signed up through your link yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.data.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{u.name}</td>
                      <td className="py-2 pr-4">{u.email ?? "-"}</td>
                      <td className="py-2 pr-4">{u.referredAt ? formatDateTime(u.referredAt) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <PaginationLinks
            page={referrals.meta.page}
            totalPages={referrals.meta.totalPages}
            paramName="refPage"
            otherParams={{ ordPage: String(ordPage) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attributed orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders attributed to you yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Order #</th>
                    <th className="py-2 pr-4 font-medium">Customer</th>
                    <th className="py-2 pr-4 font-medium">Amount</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-mono">{o.orderNumber}</td>
                      <td className="py-2 pr-4">{o.customerName}</td>
                      <td className="py-2 pr-4">{formatPrice(o.totalAmount)}</td>
                      <td className="py-2 pr-4">
                        <Badge variant="outline" className="capitalize">
                          {o.orderStatus}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4">{formatDateTime(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <PaginationLinks
            page={orders.meta.page}
            totalPages={orders.meta.totalPages}
            paramName="ordPage"
            otherParams={{ refPage: String(refPage) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function PaginationLinks({
  page,
  totalPages,
  paramName,
  otherParams,
}: {
  page: number;
  totalPages: number;
  paramName: "refPage" | "ordPage";
  otherParams: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const search = new URLSearchParams({ ...otherParams, [paramName]: String(p) });
    return `/agent/dashboard?${search.toString()}`;
  };

  return (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={page <= 1 ? "pointer-events-none text-muted-foreground" : "text-theme-primary hover:underline"}
      >
        Previous
      </Link>
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={
          page >= totalPages ? "pointer-events-none text-muted-foreground" : "text-theme-primary hover:underline"
        }
      >
        Next
      </Link>
    </div>
  );
}
