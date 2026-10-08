import { createServerFn } from "@tanstack/react-start";
import { getAuthState } from "./auth";
import { getSupabaseServerClient } from "./supabase/server";

export type PlatformSnapshot = {
  configured: boolean;
  authorized: boolean;
  vendors: { total: number; published: number };
  orders: {
    total: number;
    byStatus: Array<{ status: string; count: number }>;
    grossNgn: number;
    grossUsd: number;
  };
  payouts: { pending: number; pendingNgn: number };
  vendorRows: Array<{
    name: string;
    slug: string;
    tier: string;
    status: string;
    published: boolean;
  }>;
};

const empty: PlatformSnapshot = {
  configured: false,
  authorized: true,
  vendors: { total: 0, published: 0 },
  orders: { total: 0, byStatus: [], grossNgn: 0, grossUsd: 0 },
  payouts: { pending: 0, pendingNgn: 0 },
  vendorRows: [],
};

export const getPlatformSnapshot = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlatformSnapshot> => {
    const auth = await getAuthState();
    if (!auth.user?.roles.includes("admin"))
      return { ...empty, authorized: false };
    if (!auth.configured) return { ...empty, configured: false };
    const client = getSupabaseServerClient();
    const [vendorResult, orderResult, payoutResult] = await Promise.all([
      client
        .from("vendors")
        .select("business_name,shop_slug,subscription_tier,subscription_status,published"),
      client.from("orders").select("status,currency,total"),
      client
        .from("payouts")
        .select("amount,currency,status")
        .in("status", ["requested", "processing"]),
    ]);
    if (vendorResult.error || orderResult.error || payoutResult.error)
      throw new Error("Unable to compile the platform snapshot.");
    const vendors = vendorResult.data ?? [];
    const orders = orderResult.data ?? [];
    const payouts = payoutResult.data ?? [];
    const byStatus = new Map<string, number>();
    let grossNgn = 0;
    let grossUsd = 0;
    for (const order of orders) {
      if (order.status === "cancelled" || order.status === "refunded") continue;
      if (order.currency === "NGN") grossNgn += Number(order.total);
      else grossUsd += Number(order.total);
      byStatus.set(order.status, (byStatus.get(order.status) ?? 0) + 1);
    }
    return {
      configured: true,
      authorized: true,
      vendors: {
        total: vendors.length,
        published: vendors.filter((vendor) => vendor.published).length,
      },
      orders: {
        total: orders.length,
        byStatus: [...byStatus.entries()]
          .map(([status, count]) => ({ status, count }))
          .sort((a, b) => b.count - a.count),
        grossNgn,
        grossUsd,
      },
      payouts: {
        pending: payouts.length,
        pendingNgn: payouts
          .filter((payout) => payout.currency === "NGN")
          .reduce((sum, payout) => sum + Number(payout.amount), 0),
      },
      vendorRows: vendors.map((vendor) => ({
        name: vendor.business_name,
        slug: vendor.shop_slug,
        tier: vendor.subscription_tier,
        status: vendor.subscription_status,
        published: vendor.published,
      })),
    };
  },
);
