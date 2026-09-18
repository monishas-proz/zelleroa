export interface AgentReferredUser {
  id: string;
  name: string;
  email: string | null;
  referredAt: string | null;
}

export interface AgentAttributedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface AgentDashboardSummary {
  referralCode: string;
  referralLink: string;
  totalReferredUsers: number;
  totalAttributedOrders: number;
  totalAttributedOrderValue: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
