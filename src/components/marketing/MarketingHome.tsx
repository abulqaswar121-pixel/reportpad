import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  CalendarClock,
  Check,
  Globe2,
  MapPinned,
  MessageCircle,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Shell } from "./SiteShell";
import { FAQ } from "./StaticPages";
import { formatMoney, marketplaceQuery, type CatalogItem } from "@/lib/marketplace";
import { addToVendorBag } from "@/lib/usePersistentCart";

const storePreviews = [
  { image: "/store-preview-fashion.jpg", name: "AMARI ATELIER", links: "SHOP · STORY · BAG", type: "Minimal Luxe" },
  { image: "/store-preview-grocery.jpg", name: "ZURI FRESH", links: "MARKET · RECIPES · BASKET", type: "Vibrant Retail" },
  { image: "/store-preview-logistics.jpg", name: "KORA CARGO", links: "SERVICES · TRACK · QUOTE", type: "Corporate Trust" },
];

const plans = [
  {
    name: "Starter",
    monthly: "₦5,000",
    annual: "₦48,000",
    fee: "2.5% platform fee",
    desc: "Everything you need to begin selling.",
    features: ["Maximum 30 products", "Local Naira transactions", "WhatsApp checkout", "Flat state delivery setup"],
  },
  {
    name: "Pro",
    monthly: "₦15,000",
    annual: "₦144,000",
    fee: "1.5% platform fee",
    desc: "For ambitious brands ready to scale.",
    features: ["Unlimited products", "Advanced component layouts", "Live calendar booking tools", "Inventory tracking alerts"],
    popular: true,
  },
  {
    name: "Global Enterprise",
    monthly: "₦40,000",
    annual: "₦384,000",
    fee: "1.0% local · 3.5% international",
    desc: "Borderless infrastructure for global teams.",
    features: ["USD, GBP and NGN displays", "Stripe & Flutterwave processing", "Custom domain configuration", "Meta XML feeds & server-side CAPI"],
  },
];

const capabilities = [
  {
    icon: MessageCircle,
    title: "WhatsApp-first order routing",
    body: "Customers prepare a cart in your storefront and send the complete item list, delivery zone and total to your active WhatsApp line — a structured order brief, not a chat scramble.",
  },
  {
    icon: MapPinned,
    title: "Per-state regional delivery pricing",
    body: "Define zones per state with their own fees and delivery windows. Shoppers see the exact charge before checkout, so your team never negotiates delivery again.",
  },
  {
    icon: Banknote,
    title: "Multi-currency card rails",
    body: "Naira at home through Paystack; USD and GBP abroad through Flutterwave. The correct rail appears automatically based on the customer's destination.",
  },
  {
    icon: Radio,
    title: "Meta catalogue & Conversions API",
    body: "Publish a live XML product feed for Meta catalogues and stream server-side purchase events — without third-party middleware.",
  },
  {
    icon: CalendarClock,
    title: "Bookings, seats & allocation",
    body: "Tour dates, service slots and ticketed events carry live capacity, so customers only ever book what is truly available.",
  },
  {
    icon: ShieldCheck,
    title: "Private by architecture",
    body: "Vendor ownership boundaries are enforced at the database layer with row-level security. Your ledger, customers and inventory stay yours.",
  },
];

export function MarketingHome() {
  const { data } = useSuspenseQuery(marketplaceQuery());
  const [annual, setAnnual] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [category, setCategory] = useState("All");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setInterval(
      () => setPreviewIndex((index) => (index + 1) % storePreviews.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, []);

  const showcase = useMemo(() => {
    const pool = category === "All" ? data.items : data.items.filter((item) => item.category === category);
    const featured = pool.filter((item) => item.featured);
    return (featured.length >= 4 ? featured : pool).slice(0, 8);
  }, [data.items, category]);

  const quickAdd = (item: CatalogItem) => {
    if (addToVendorBag(item.vendorSlug, item.id, null)) {
      setAdded((current) => ({ ...current, [item.id]: true }));
      window.setTimeout(() => setAdded((current) => ({ ...current, [item.id]: false })), 1400);
    }
  };

  const preview = storePreviews[previewIndex];

  return (
    <Shell>
      {/* ================= HERO — deep navy anchor ================= */}
      <section className="anchor-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-5 sm:py-24 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="size-3.5" />
              Commerce without borders
            </p>
            <h1 className="mt-6 max-w-3xl text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl">
              Launch and scale your online commerce across Africa and globally.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
              NDH eStore gives merchants one calm operating system: a designed
              storefront, WhatsApp-first ordering, per-state delivery pricing
              and multi-currency payments — engineered by Najeeb Digital Hub.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-accent-foreground hover:bg-cyan"
              >
                Start selling <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/catalog"
                className="rounded-full border border-white/25 px-6 py-3.5 font-bold text-white hover:border-white/50"
              >
                Explore marketplace
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/45">
              14-day free trial · No card required · Publish today
            </p>
          </div>

          {/* live store previews */}
          <div className="animate-rise-delay">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)]">
              <div className="flex h-11 items-center justify-between border-b border-border bg-card px-4">
                <div className="flex items-center gap-3">
                  <span className="flex gap-1.5">
                    <i className="size-2 rounded-full bg-border" />
                    <i className="size-2 rounded-full bg-border" />
                    <i className="size-2 rounded-full bg-border" />
                  </span>
                  <b className="font-display text-xs text-foreground sm:text-sm">{preview.name}</b>
                </div>
                <span className="hidden font-display text-[10px] font-semibold tracking-wider text-muted-foreground sm:block">
                  {preview.links}
                </span>
              </div>
              <div className="relative h-[300px] bg-muted sm:h-[380px]">
                <img
                  key={preview.image}
                  src={preview.image}
                  alt={`${preview.name} storefront preview`}
                  className="animate-rise size-full object-cover object-top"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {storePreviews.map((slide, index) => (
                  <button
                    key={slide.name}
                    onClick={() => setPreviewIndex(index)}
                    aria-label={`Preview ${slide.name}`}
                    className={`h-1.5 rounded-full transition-all ${previewIndex === index ? "w-8 bg-cyan" : "w-2 bg-white/25 hover:bg-white/50"}`}
                  />
                ))}
              </div>
              <span className="font-display text-[10px] font-semibold tracking-[0.18em] text-white/45">
                LIVE STORE PREVIEW · {preview.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* quiet category marquee */}
      <section className="overflow-hidden border-b border-border bg-card py-4">
        <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap font-display text-xs font-semibold tracking-[0.2em] text-muted-foreground">
          {["FASHION & BEAUTY", "GROCERY & FOOD", "CARGO & LOGISTICS", "TRAVEL & TOURS", "WHOLESALE", "DIGITAL PRODUCTS", "EVENT TICKETING", "FASHION & BEAUTY", "GROCERY & FOOD", "CARGO & LOGISTICS", "TRAVEL & TOURS", "WHOLESALE", "DIGITAL PRODUCTS", "EVENT TICKETING"].map((label, index) => (
            <span key={index} className="flex items-center gap-12">
              <span>{label}</span>
              <span className="text-cyan">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ================= PORCELAIN DISCOVERY CANVAS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Porcelain discovery canvas</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              From live stores, right now
            </h2>
          </div>
          <Link
            to="/catalog"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:border-border-strong"
          >
            Browse full catalog <ArrowRight className="size-4" />
          </Link>
        </div>

        <div id="categories" className="scroll-x mt-8 flex gap-2 pb-2">
          {["All", ...data.categories].map((name) => (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                category === name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-ink-soft hover:border-border-strong"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {showcase.length === 0 ? (
          <div className="card-porcelain mt-8 px-6 py-20 text-center">
            <Store className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">The showcase is being stocked</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Products appear here the moment merchants publish them. Open a
              store and yours can be first on the canvas.
            </p>
            <Link
              to="/signup"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              Start selling
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {showcase.map((item) => (
              <article key={item.id} className="card-porcelain card-porcelain-lift flex flex-col overflow-hidden">
                <Link
                  to="/store/$vendorSlug/product/$productSlug"
                  params={{ vendorSlug: item.vendorSlug, productSlug: item.slug }}
                  className="block aspect-[4/5] overflow-hidden bg-surface"
                >
                  <img
                    src={item.imageUrl ?? "/hero-fashion-real.jpg"}
                    alt={item.name}
                    loading="lazy"
                    className="size-full object-cover transition duration-500 hover:scale-[1.04]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{item.name}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <b className="shrink-0 font-display text-sm">{formatMoney(item.basePrice, item.currency)}</b>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                      to="/store/$vendorSlug"
                      params={{ vendorSlug: item.vendorSlug }}
                      className="flex min-w-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-border-strong hover:text-foreground"
                    >
                      <Store className="size-3 shrink-0" />
                      <span className="truncate">{item.vendorName}</span>
                    </Link>
                    <button
                      onClick={() => quickAdd(item)}
                      aria-label={`Add ${item.name} to bag`}
                      className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        added[item.id] ? "bg-success text-white" : "bg-primary text-primary-foreground hover:bg-navy-2"
                      }`}
                    >
                      {added[item.id] ? "✓" : <Plus className="size-4" />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= MERCHANT BENTO GRID ================= */}
      <section className="canvas-band border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Merchant architecture</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Real infrastructure, not decoration.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every capability below ships in the platform today — the same
              systems your dashboard, storefront and checkout run on.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {capabilities.slice(0, 3).map((feature) => (
              <div key={feature.title} className="card-porcelain card-porcelain-lift p-7">
                <div className="grid size-12 place-items-center rounded-xl bg-primary text-cyan">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.body}</p>
              </div>
            ))}
            <div className="anchor-navy rounded-[var(--radius-xl)] p-7 lg:col-span-2">
              <Globe2 className="absolute -bottom-10 -right-10 size-44 opacity-10" />
              <p className="eyebrow">Borderless checkout</p>
              <h3 className="mt-4 max-w-md text-2xl font-semibold text-white">
                Naira at home. Dollars and pounds abroad. The right rail appears automatically.
              </h3>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
                {["NGN · Paystack", "USD · Flutterwave", "GBP · Flutterwave"].map((rail) => (
                  <div key={rail} className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-center font-display text-[11px] font-semibold tracking-wide text-white/80">
                    {rail}
                  </div>
                ))}
              </div>
            </div>
            {capabilities.slice(3).map((feature) => (
              <div key={feature.title} className="card-porcelain card-porcelain-lift p-7">
                <div className="grid size-12 place-items-center rounded-xl bg-surface text-foreground">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 rounded-xl border border-border bg-card px-5 py-4 text-xs leading-6 text-muted-foreground">
            Verified merchant stories will be published here as they are
            approved. Until then, this space presents platform capabilities
            only — no invented scores, quotes or volume claims.
          </p>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24">
        <div className="text-center">
          <p className="eyebrow">Simple, honest pricing</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Choose your growth lane.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free for 14 days. Upgrade when your business is ready.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Annual · save 20%
            </button>
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-porcelain relative flex flex-col p-7 ${plan.popular ? "border-cyan shadow-[0_18px_50px_-20px_rgba(34,211,238,0.35)] lg:-translate-y-2" : ""}`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 font-display text-[10px] font-semibold tracking-widest text-cyan">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <p className="mt-8 font-display text-4xl font-semibold">
                {annual ? plan.annual : plan.monthly}
                <span className="text-sm font-normal text-muted-foreground">/{annual ? "yr" : "mo"}</span>
              </p>
              <p className="mt-2 text-xs font-semibold text-info">{plan.fee}</p>
              <Link
                to="/signup"
                className={`mt-7 block w-full rounded-full px-5 py-3 text-center text-sm font-bold ${plan.popular ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-border-strong"}`}
              >
                Start free trial
              </Link>
              <div className="mt-7 space-y-3.5">
                {plan.features.map((feature) => (
                  <p key={feature} className="flex gap-3 text-sm text-ink-soft">
                    <Check className="size-4 shrink-0 text-cyan" />
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FAQ />
    </Shell>
  );
}
