import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Card, StatusBadge } from "@/components/ui/primitives";
import { GatewayMark } from "@/components/brand/GatewayMark";
import { getAuthState } from "@/lib/auth";
import { getPlatformSnapshot } from "@/lib/admin";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: pageMeta({
      title: "Platform review — admin | NDH eStore",
      description:
        "Live platform health for NDH eStore administrators: published stores, order flow and payout queue, straight from the ledger.",
    }),
  }),
  beforeLoad: async () => {
    const auth = await getAuthState();
    if (auth.configured && !auth.user) throw redirect({ to: "/signin" });
    if (auth.configured && !auth.user?.roles.includes("admin"))
      throw redirect({ to: "/" });
    return { auth };
  },
  component: Admin,
});

function money(amount: number, currency: string) {
  return currency === "NGN"
    ? `₦${amount.toLocaleString()}`
    : new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
}

function Admin() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "snapshot"],
    queryFn: () => getPlatformSnapshot(),
  });

  return (
    <main className="min-h-screen bg-background p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <GatewayMark size={44} />
          <div>
            <p className="eyebrow">Najeeb Digital Hub · Administration</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Platform review
            </h1>
          </div>
        </div>

        {!data && isLoading && (
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        )}

        {data && !data.configured && (
          <Card className="mt-8 flex items-start gap-4 p-6">
            <ShieldCheck className="size-6 shrink-0 text-info" />
            <div>
              <h2 className="text-lg font-semibold">Backend not connected</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                This environment has no Supabase credentials, so the live
                platform ledger is unavailable. Connect the backend to review
                real stores, orders and payouts — no sample figures are shown
                in their place.
              </p>
            </div>
          </Card>
        )}

        {data?.configured && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="p-5">
                <p className="field-label">Published stores</p>
                <p className="mt-3 font-display text-3xl font-semibold">
                  {data.vendors.published}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    of {data.vendors.total} registered
                  </span>
                </p>
              </Card>
              <Card className="p-5">
                <p className="field-label">Orders on record</p>
                <p className="mt-3 font-display text-3xl font-semibold">
                  {data.orders.total}
                </p>
              </Card>
              <Card className="p-5">
                <p className="field-label">Gross processed</p>
                <p className="mt-3 font-display text-xl font-semibold">
                  {money(data.orders.grossNgn, "NGN")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {money(data.orders.grossUsd, "USD")} international
                </p>
              </Card>
              <Card className="p-5">
                <p className="field-label">Payout queue</p>
                <p className="mt-3 font-display text-3xl font-semibold">
                  {data.payouts.pending}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {money(data.payouts.pendingNgn, "NGN")} awaiting transfer
                </p>
              </Card>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
              <Card className="overflow-hidden">
                <div className="border-b border-border bg-surface px-5 py-4">
                  <h2 className="font-semibold">Vendor registry</h2>
                </div>
                {data.vendorRows.length === 0 ? (
                  <p className="px-5 py-14 text-center text-sm text-muted-foreground">
                    No vendors registered yet. Stores appear here the moment a
                    merchant completes onboarding.
                  </p>
                ) : (
                  <div className="scroll-x overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Store</th>
                          <th>Tier</th>
                          <th>Status</th>
                          <th>Visibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.vendorRows.map((vendor) => (
                          <tr key={vendor.slug}>
                            <td>
                              <Link
                                to="/store/$vendorSlug"
                                params={{ vendorSlug: vendor.slug }}
                                className="font-semibold text-foreground hover:text-info"
                              >
                                {vendor.name}
                              </Link>
                              <p className="text-xs text-muted-foreground">/{vendor.slug}</p>
                            </td>
                            <td className="capitalize">{vendor.tier.replace(/_/g, " ")}</td>
                            <td><StatusBadge status={vendor.status} /></td>
                            <td>
                              {vendor.published ? (
                                <StatusBadge status="active" label="Published" />
                              ) : (
                                <StatusBadge status="neutral" label="Draft" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              <Card className="p-5">
                <h2 className="font-semibold">Order flow by status</h2>
                {data.orders.byStatus.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">
                    No orders yet — the flow chart fills in as checkout events
                    land.
                  </p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {data.orders.byStatus.map((row) => {
                      const max = Math.max(...data.orders.byStatus.map((r) => r.count));
                      return (
                        <div key={row.status}>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="capitalize">{row.status.replace(/_/g, " ")}</span>
                            <span className="text-muted-foreground">{row.count}</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-surface">
                            <div
                              className="h-full rounded-full bg-cyan"
                              style={{ width: `${Math.max(6, (row.count / max) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
