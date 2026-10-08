import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge, Button, StatusBadge } from "@/components/ui/primitives";
import { demoVendor } from "@/lib/data";
import { vendorProductsQuery } from "@/lib/products";
import { vendorOrdersQuery } from "@/lib/vendorOrders";
import { metaSettingsQuery } from "@/lib/meta";
import { signOut } from "@/lib/auth";
import type { SubscriptionAccess } from "@/lib/subscription";
import {
  BarChart3,
  Box,
  Copy,
  ExternalLink,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Palette,
  ShoppingBag,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { GatewayMark } from "@/components/brand/GatewayMark";
import { OrderManager } from "./OrderManager";
import { ShippingManager } from "./ShippingManager";
import { PayoutManager } from "./PayoutManager";
import { MetaManager } from "./MetaManager";
import { ProductManager } from "./ProductManager";

const tabs = [
  ["overview", "Overview", LayoutDashboard],
  ["orders", "Orders", ShoppingBag],
  ["products", "Products", Box],
  ["design", "Design DNA", Palette],
  ["marketing", "Ads & marketing", BarChart3],
  ["logistics", "Logistics", Truck],
  ["billing", "Billing & ledger", Wallet],
] as const;

export function VendorDashboard({ subscription }: { subscription: SubscriptionAccess }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>(subscription.hasAccess ? "overview" : "billing");
  const [mobileNav, setMobileNav] = useState(false);
  const expired = !subscription.hasAccess;
  const locked = expired && tab !== "billing";

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* navy rail */}
      <aside className="anchor-navy z-40 p-4 lg:fixed lg:inset-y-0 lg:w-64">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3 p-2">
            <GatewayMark size={38} />
            <div className="min-w-0">
              <b className="block truncate font-display text-sm text-white">{demoVendor.business_name}</b>
              <p className="text-[11px] text-white/50">Vendor workspace</p>
            </div>
          </div>
          <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation">
            <X className="size-4" />
          </button>
        </div>
        <nav className={`mt-6 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:pb-0 ${mobileNav ? "block" : "hidden lg:block"}`}>
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => {
                setTab(expired && id !== "billing" ? "billing" : id);
                setMobileNav(false);
              }}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm lg:w-full ${
                tab === id ? "bg-white/10 font-semibold text-cyan" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-8 hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white lg:block">
          <b className="font-display text-xs uppercase tracking-widest text-white/80">
            {subscription.tier.replaceAll("_", " ")} · {subscription.billingCycle}
          </b>
          <p className="mt-1 text-xs text-white/50">
            {subscription.status === "past_due"
              ? `Grace period: ${subscription.daysRemaining} days left`
              : subscription.status === "expired"
                ? "Renewal required"
                : `${subscription.daysRemaining} days remaining`}
          </p>
          <div className="mt-3 h-1 rounded bg-white/10">
            <div className="h-full w-2/3 rounded bg-cyan" />
          </div>
        </div>
        <button
          onClick={async () => {
            await signOut();
            await navigate({ to: "/signin" });
          }}
          className="mt-3 hidden w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 hover:bg-white/5 hover:text-white lg:flex"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="grid size-10 place-items-center rounded-full border border-border lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation">
                <Menu className="size-4" />
              </button>
              <div>
                <p className="eyebrow">Workspace</p>
                <h1 className="text-xl font-semibold capitalize">{tab.replace("-", " ")}</h1>
              </div>
            </div>
            <StatusBadge status={subscription.status} label={subscription.status.replace("_", " ")} />
          </div>
          <div className="mx-auto mt-3 flex max-w-7xl items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs text-ink-soft">
            <span className="truncate">ndh.com.ng/store/{demoVendor.shop_slug}</span>
            <button title="Copy store link" onClick={() => void navigator.clipboard.writeText(`https://ndh.com.ng/store/${demoVendor.shop_slug}`)}>
              <Copy className="size-3" />
            </button>
            <a href={`/store/${demoVendor.shop_slug}`} aria-label="Open public store">
              <ExternalLink className="size-3" />
            </a>
          </div>
          {subscription.status === "past_due" && (
            <div className="mx-auto mt-3 max-w-7xl rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-xs font-semibold text-warning">
              Payment is past due. You have {subscription.daysRemaining} day{subscription.daysRemaining === 1 ? "" : "s"} remaining before workspace access is suspended. Update billing now.
            </div>
          )}
          {subscription.status === "trial" && (
            <div className="mx-auto mt-3 max-w-7xl rounded-xl bg-surface px-4 py-3 text-xs font-semibold text-ink-soft">
              Your free trial has {subscription.daysRemaining} day{subscription.daysRemaining === 1 ? "" : "s"} remaining.
            </div>
          )}
        </header>

        <div className="relative mx-auto max-w-7xl p-5 lg:p-8">
          {expired && tab === "billing" && (
            <div className="card-porcelain mb-5 border-destructive/30 bg-destructive-soft p-5">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div>
                  <h2 className="font-bold text-destructive">Workspace access suspended</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Your subscription has expired. Please renew your plan via the Billing tab to reactivate your store and access your data.
                  </p>
                </div>
              </div>
            </div>
          )}
          {locked && (
            <div className="absolute inset-4 z-40 grid place-items-center rounded-3xl bg-card/80 backdrop-blur">
              <div className="card-porcelain max-w-md p-8 text-center">
                <Lock className="mx-auto size-8" />
                <h2 className="mt-4 text-xl font-semibold">Your subscription has expired</h2>
                <p className="mt-3 text-muted-foreground">Please renew your plan via the Billing tab to reactivate your store and access your data.</p>
                <Button className="mt-6" onClick={() => setTab("billing")}>Open billing</Button>
              </div>
            </div>
          )}
          {tab === "overview" && !expired && <Overview />}
          {tab === "orders" && <OrderManager />}
          {tab === "products" && <ProductManager />}
          {tab === "design" && <DesignLab />}
          {tab === "marketing" && <MetaManager />}
          {tab === "logistics" && <ShippingManager />}
          {tab === "billing" && (
            <>
              <div className="card-porcelain mb-5 flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="field-label">Current subscription</p>
                  <p className="mt-2 text-2xl font-semibold capitalize">
                    {subscription.tier.replaceAll("_", " ")} · {subscription.billingCycle}
                  </p>
                  <div className="mt-3">
                    <StatusBadge status={subscription.status} label={subscription.status.replace("_", " ")} />
                  </div>
                </div>
                <Button>{subscription.status === "expired" ? "Renew with Paystack" : "Manage subscription"}</Button>
              </div>
              <PayoutManager />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview — compiled strictly from live workspace queries            */
/* ------------------------------------------------------------------ */

function Overview() {
  const orders = useSuspenseQuery(vendorOrdersQuery({ status: "all", search: "", page: 1 })).data;
  const products = useSuspenseQuery(vendorProductsQuery()).data;
  const meta = useSuspenseQuery(metaSettingsQuery()).data;
  const list = products.products;
  const lowStock = list.filter((p) => p.product_type === "physical" && p.stock_count > 0 && p.stock_count <= 5);
  const outOfStock = list.filter((p) => p.product_type === "physical" && p.stock_count === 0);
  const live = list.filter((p) => p.is_active);
  const needsFulfilment = orders.orders.filter((o) => o.status === "pending" || o.status === "paid");
  const money = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: currency === "NGN" ? 0 : 2 }).format(amount);

  return (
    <>
      {!orders.configured && (
        <p className="mb-5 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
          Preview workspace with sample records. Connect Supabase to see your live ledger.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Processed orders", String(orders.summary.orders)],
          ["NGN processed", money(orders.summary.grossNgn, "NGN")],
          ["USD processed", money(orders.summary.grossUsd, "USD")],
          ["Live products", `${live.length} of ${list.length}`],
        ].map(([label, value]) => (
          <div key={label} className="card-porcelain p-5">
            <p className="field-label">{label}</p>
            <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-porcelain overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
            <b className="font-semibold">Latest orders</b>
            <span className="text-xs text-muted-foreground">{orders.total} total</span>
          </div>
          {orders.orders.length === 0 ? (
            <p className="px-5 py-16 text-center text-sm text-muted-foreground">
              No orders yet. The moment a customer checks out, the order lands here with its full brief.
            </p>
          ) : (
            <div className="scroll-x overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.orders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td className="font-semibold text-foreground">NDH-{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td className="num text-right font-semibold">{money(order.total, order.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-porcelain p-6">
          <b className="font-semibold">Action centre</b>
          <div className="mt-4 space-y-3">
            {needsFulfilment.length > 0 && (
              <p className="rounded-xl bg-warning-soft px-3 py-2.5 text-xs font-semibold text-warning">
                {needsFulfilment.length} order{needsFulfilment.length === 1 ? "" : "s"} awaiting fulfilment.
              </p>
            )}
            {lowStock.slice(0, 3).map((p) => (
              <p key={p.id} className="rounded-xl bg-surface px-3 py-2.5 text-xs text-ink-soft">
                <b>{p.name}</b> is low on stock ({p.stock_count} left).
              </p>
            ))}
            {outOfStock.slice(0, 2).map((p) => (
              <p key={p.id} className="rounded-xl bg-destructive-soft px-3 py-2.5 text-xs font-semibold text-destructive">
                {p.name} is out of stock.
              </p>
            ))}
            {!meta.pixelId && (
              <p className="rounded-xl bg-info-soft px-3 py-2.5 text-xs font-semibold text-info">
                Connect your Meta Pixel in Ads & marketing to unlock catalogues and CAPI.
              </p>
            )}
            {needsFulfilment.length === 0 && lowStock.length === 0 && outOfStock.length === 0 && meta.pixelId && (
              <p className="rounded-xl bg-success-soft px-3 py-2.5 text-xs font-semibold text-success">
                All clear — nothing needs your attention right now.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Design DNA lab                                                      */
/* ------------------------------------------------------------------ */

function DesignLab() {
  const [nav, setNav] = useState("floating_island");
  const [accent, setAccent] = useState("#070F1E");
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
      <div className="card-porcelain p-6">
        <h2 className="text-xl font-semibold">Store architecture</h2>
        <span className="field-label mt-7 block">Navigation layout</span>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["centered", "Centered Classic"],
            ["left_compact", "Left Compact"],
            ["floating_island", "Floating Island"],
            ["sidebar", "Mobile Sidebar"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setNav(id)}
              className={`rounded-xl border p-4 text-left text-sm ${nav === id ? "border-primary bg-surface font-semibold" : "border-border hover:border-border-strong"}`}
            >
              <Menu className="mb-3 size-5" />
              {label}
            </button>
          ))}
        </div>
        <label className="mt-6 block text-sm font-semibold">
          Accent colour
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-border bg-card" />
        </label>
        <label className="mt-6 block text-sm font-semibold">
          Typography
          <select className="field mt-2">
            <option>Minimal Luxe</option>
            <option>Corporate Trust</option>
            <option>Street Bold</option>
          </select>
        </label>
        {["Brand description", "Dynamic page routes", "Trust parameters", "Newsletter capture"].map((x) => (
          <label key={x} className="mt-4 flex justify-between rounded-xl bg-surface p-3 text-sm">
            {x}
            <input type="checkbox" defaultChecked />
          </label>
        ))}
      </div>
      <div className="card-porcelain grid min-h-[650px] place-items-center bg-surface p-5">
        <div className="h-[590px] w-[290px] overflow-hidden rounded-[36px] border-8 border-foreground bg-card shadow-2xl">
          <div className="p-4 text-white" style={{ backgroundColor: accent }}>
            <div className="text-center text-xs">NEW SEASON IS HERE</div>
            <div className="mt-4 flex justify-between">
              <b className="font-display">AMARI</b>
              <Menu className="size-4" />
            </div>
          </div>
          <div className="p-4">
            <div className="h-52 rounded-2xl bg-muted p-5">
              <Badge>THE EDIT</Badge>
              <h3 className="mt-6 text-3xl font-semibold">Quiet luxury, made personal.</h3>
            </div>
            <p className="mt-5 font-bold">Featured pieces</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-28 rounded-xl bg-surface" />
              <div className="h-28 rounded-xl bg-surface" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
