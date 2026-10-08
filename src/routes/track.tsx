import { type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Shell } from "@/components/marketing/SiteShell";
import { StatusBadge, Card } from "@/components/ui/primitives";
import { lookupOrder, type TrackedOrder } from "@/lib/tracking";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: pageMeta({
      title: "Track your order | NDH eStore",
      description:
        "Look up the status of any NDH eStore order with your order number and the email used at checkout.",
    }),
  }),
  component: TrackPage,
});

function money(amount: number, currency: string) {
  return currency === "NGN"
    ? `₦${amount.toLocaleString()}`
    : new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
}

function TrackPage() {
  const lookup = useMutation({ mutationFn: (value: { orderNumber: string; email: string }) => lookupOrder({ data: value }) });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    lookup.mutate({
      orderNumber: String(form.get("orderNumber") ?? ""),
      email: String(form.get("email") ?? ""),
    });
  };
  const error = lookup.data && !lookup.data.ok ? lookup.data.error : "";

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-5 sm:py-20">
        <p className="eyebrow">Order tracking</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Where is my order?
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Enter the order number from your confirmation (for example the number
          shown after checkout) and the email address you used. We only reveal
          orders that match both.
        </p>

        <form onSubmit={submit} className="card-porcelain mt-8 grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="block">
            <span className="field-label">Order number</span>
            <input
              name="orderNumber"
              required
              inputMode="numeric"
              placeholder="NDH-123456"
              className="field mt-2"
            />
          </label>
          <label className="block">
            <span className="field-label">Email at checkout</span>
            <input name="email" required type="email" placeholder="you@example.com" className="field mt-2" />
          </label>
          <button
            disabled={lookup.isPending}
            className="h-[46px] rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-navy-2 disabled:opacity-50"
          >
            {lookup.isPending ? <LoaderCircle className="mx-auto size-4 animate-spin" /> : "Track"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-border bg-destructive-soft px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {lookup.data?.ok && lookup.data.order && (
          <TrackedResult order={lookup.data.order} />
        )}
      </section>
    </Shell>
  );
}

function TrackedResult({ order }: { order: TrackedOrder }) {
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-6 py-5">
        <div>
          <p className="text-xs text-muted-foreground">Order</p>
          <h2 className="font-display text-xl font-semibold">NDH-{order.orderNumber}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.storeName}
            {order.storeSlug ? (
              <>
                {" · "}
                <Link className="font-semibold text-info" to="/store/$vendorSlug" params={{ vendorSlug: order.storeSlug }}>
                  visit store
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="px-6 py-5">
        <h3 className="field-label">Items</h3>
        <div className="mt-3 space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between gap-4 text-sm">
              <span className="text-ink-soft">
                {item.quantity}× {item.name}
                {item.variant ? <span className="text-muted-foreground"> ({item.variant})</span> : null}
              </span>
              <span className="num font-semibold">{money(item.unitPrice * item.quantity, order.currency)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{money(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{money(order.shippingFee, order.currency)}</span>
          </div>
          <div className="flex justify-between pt-1 font-display text-base font-semibold">
            <span>Total</span>
            <span>{money(order.total, order.currency)}</span>
          </div>
        </div>

        {order.history.length > 0 && (
          <>
            <h3 className="field-label mt-6">History</h3>
            <ol className="mt-3 space-y-3">
              {order.history.map((entry, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-cyan" />
                  <div>
                    <span className="font-semibold capitalize">{entry.status.replace(/_/g, " ")}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.createdAt))}
                    </span>
                    {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </Card>
  );
}

