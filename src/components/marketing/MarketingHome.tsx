import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  CalendarCheck,
  Check,
  CreditCard,
  Globe2,
  Link2,
  MessageCircle,
  Palette,
  Package,
  Share2,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Shell } from "./SiteShell";
import { FAQ } from "./StaticPages";
import { formatMoney, marketplaceQuery, type CatalogItem } from "@/lib/marketplace";
import { addToVendorBag } from "@/lib/usePersistentCart";
import { storeUrl } from "@/lib/brand";
import { plans } from "@/lib/plans";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/** Core SaaS value pillars — what a merchant is actually buying. */
const pillars = [
  {
    icon: Link2,
    title: "Own your brand & link",
    body: "Your own store address, logo, banner and brand colours. Customers buy from your brand — not inside someone else's marketplace.",
    proof: "ndhshopos.com/store/yourbrand",
  },
  {
    icon: Package,
    title: "Sell anything",
    body: "Physical products with inventory alerts, instant digital file downloads, and service or appointment bookings — all in one catalogue.",
    proof: "Products · Downloads · Bookings",
  },
  {
    icon: Truck,
    title: "Nationwide logistics ready",
    body: "A built-in state-by-state Nigeria shipping calculator with delivery windows, plus heavy cargo handling for bulky consignments.",
    proof: "36 states + FCT rate engine",
  },
  {
    icon: CreditCard,
    title: "Flexible checkout",
    body: "Accept Naira, USD and GBP by card, bank transfer or USSD — plus one-tap WhatsApp orders for customers who prefer to chat.",
    proof: "NGN · USD · GBP",
  },
  {
    icon: Wallet,
    title: "Fast seller payouts",
    body: "An automated earnings ledger, saved bank account management and verified withdrawals, so settlement day is never a guess.",
    proof: "Automated earnings ledger",
  },
  {
    icon: BarChart3,
    title: "Built-in growth tools",
    body: "Meta Pixel and ad conversion tracking, real-time order tracking and Nia, your AI customer care assistant, working while you sleep.",
    proof: "Pixel · Tracking · Nia AI",
  },
];

const steps = [
  {
    title: "Register your brand",
    body: "Pick your business name and claim your unique store link in a two-minute onboarding flow.",
  },
  {
    title: "Add products and set delivery",
    body: "Upload products or digital files, set state delivery fees and choose the colours that match your brand.",
  },
  {
    title: "Share your link and sell",
    body: "Post your store link on Instagram, WhatsApp or TikTok and start receiving paid orders the same day.",
  },
];

/** Merchant store themes shown in the hero mockup. */
const storePreviews = [
  {
    slug: "amari-atelier",
    name: "Amari Atelier",
    category: "Fashion & beauty",
    image: "/store-preview-fashion.jpg",
    accent: "#173f32",
    tint: "#f4efe6",
    products: [
      { name: "Raw Vietnamese Wave", price: "₦185,000" },
      { name: "The Nia Bob", price: "₦98,000" },
    ],
  },
  {
    slug: "zuri-fresh",
    name: "Zuri Fresh",
    category: "Grocery & food",
    image: "/store-preview-grocery.jpg",
    accent: "#0e7490",
    tint: "#f0f9ff",
    products: [
      { name: "Weekly Farm Basket", price: "₦24,500" },
      { name: "Cold-Pressed Oil 5L", price: "₦18,900" },
    ],
  },
  {
    slug: "kora-cargo",
    name: "Kora Cargo",
    category: "Cargo & logistics",
    image: "/store-preview-logistics.jpg",
    accent: "#0b192c",
    tint: "#f8fafc",
    products: [
      { name: "Lagos → Kano · 25kg", price: "₦12,400" },
      { name: "Heavy Cargo Quote", price: "On request" },
    ],
  },
];

const marqueeItems = [
  "FASHION & BEAUTY",
  "GROCERY & FOOD",
  "CARGO & LOGISTICS",
  "TRAVEL & TOURS",
  "DIGITAL PRODUCTS",
  "SERVICE BOOKINGS",
  "EVENT TICKETING",
  "WHOLESALE",
];

/* ------------------------------------------------------------------ */
/* Hero visual — storefront + merchant admin mockup                    */
/* ------------------------------------------------------------------ */

type PreviewTab = "storefront" | "admin";

function HeroMockup() {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<PreviewTab>("storefront");
  const preview = storePreviews[index];

  return (
    <div className="min-w-0">
      <div className="store-demo">
        {/* browser chrome */}
        <div className="store-demo-bar">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <i className="size-2 rounded-full bg-border" />
            <i className="size-2 rounded-full bg-border" />
            <i className="size-2 rounded-full bg-border" />
          </span>
          <span className="store-demo-url" title={storeUrl(preview.slug)}>
            <Globe2 className="size-3 shrink-0 text-muted-foreground" />
            <span className="truncate">{storeUrl(preview.slug)}</span>
          </span>
        </div>

        {/* preview tabs */}
        <div className="demo-tabs" role="tablist" aria-label="Preview merchant experience">
          <button
            role="tab"
            aria-selected={tab === "storefront"}
            data-active={tab === "storefront"}
            onClick={() => setTab("storefront")}
            className="demo-tab"
          >
            STOREFRONT
          </button>
          <button
            role="tab"
            aria-selected={tab === "admin"}
            data-active={tab === "admin"}
            onClick={() => setTab("admin")}
            className="demo-tab"
          >
            MERCHANT ADMIN
          </button>
        </div>

        {tab === "storefront" ? (
          <div className="min-w-0">
            {/* storefront header, themed by merchant colours */}
            <div
              className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4"
              style={{ background: preview.tint }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-full font-display text-[10px] font-bold text-white"
                  style={{ background: preview.accent }}
                >
                  {preview.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <span className="min-w-0">
                  <b className="block truncate font-display text-xs sm:text-sm" style={{ color: preview.accent }}>
                    {preview.name}
                  </b>
                  <span className="block truncate text-[10px] text-muted-foreground">{preview.category}</span>
                </span>
              </div>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="hidden rounded-full bg-white/80 px-2.5 py-1 font-display text-[10px] font-semibold text-ink-soft sm:inline">
                  SHOP · ABOUT
                </span>
                <span
                  className="relative grid size-7 place-items-center rounded-full text-white"
                  style={{ background: preview.accent }}
                >
                  <ShoppingBag className="size-3.5" />
                  <i className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent ring-2 ring-white" />
                </span>
              </span>
            </div>

            {/* hero image */}
            <div className="relative h-40 overflow-hidden bg-muted sm:h-52">
              <img
                key={preview.image}
                src={preview.image}
                alt={`${preview.name} storefront preview`}
                className="animate-rise size-full object-cover object-top"
                loading="eager"
              />
              <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap items-center gap-1.5">
                <span className="demo-chip">
                  <CreditCard className="size-3" /> Card · Transfer · USSD
                </span>
                <span className="demo-chip">
                  <Truck className="size-3" /> Nationwide delivery
                </span>
              </div>
            </div>

            {/* product row */}
            <div className="grid grid-cols-2 gap-2 p-2.5 sm:gap-3 sm:p-3">
              {preview.products.map((product) => (
                <div key={product.name} className="min-w-0 rounded-xl border border-border bg-card p-2 sm:p-2.5">
                  <p className="truncate text-[11px] font-semibold sm:text-xs">{product.name}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-1.5">
                    <b className="truncate font-display text-[11px] sm:text-xs">{product.price}</b>
                    <span
                      className="grid size-5 shrink-0 place-items-center rounded-full text-white"
                      style={{ background: preview.accent }}
                    >
                      <ShoppingBag className="size-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* merchant admin view */
          <div className="min-w-0 bg-[var(--color-surface)] p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
                  MERCHANT DASHBOARD
                </p>
                <b className="mt-0.5 block truncate font-display text-sm">{preview.name}</b>
              </div>
              <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 font-display text-[10px] font-semibold text-success">
                LIVE
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="demo-stat">
                <b>₦1.84M</b>
                <span>Revenue</span>
              </div>
              <div className="demo-stat">
                <b>126</b>
                <span>Orders</span>
              </div>
              <div className="demo-stat col-span-2 sm:col-span-1">
                <b>₦412,900</b>
                <span>Available payout</span>
              </div>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {[
                ["Order #NDH-4821", "Paid · card", "success"],
                ["Order #NDH-4820", "Awaiting transfer", "warning"],
                ["Order #NDH-4819", "Shipped · Kano", "info"],
              ].map(([title, meta, tone]) => (
                <div
                  key={title}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-2"
                >
                  <span className="min-w-0">
                    <b className="block truncate font-display text-[11px]">{title}</b>
                    <span className="block truncate text-[10px] text-muted-foreground">{meta}</span>
                  </span>
                  <span className={`status-badge status-${tone}`}>{tone === "success" ? "PAID" : tone === "warning" ? "PENDING" : "SHIPPED"}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="demo-chip demo-chip-light">
                <MessageCircle className="size-3" /> WhatsApp order flow
              </span>
              <span className="demo-chip demo-chip-light">
                <Sparkles className="size-3" /> Nia AI
              </span>
            </div>
          </div>
        )}
      </div>

      {/* switcher */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {storePreviews.map((slide, i) => (
            <button
              key={slide.slug}
              onClick={() => setIndex(i)}
              aria-label={`Preview ${slide.name}`}
              aria-pressed={index === i}
              className={`h-1.5 rounded-full transition-all ${index === i ? "w-8 bg-cyan" : "w-2 bg-white/25 hover:bg-white/50"}`}
            />
          ))}
        </div>
        <span className="font-display text-[10px] font-semibold tracking-[0.16em] text-white/45">
          LIVE PREVIEW · {preview.category.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function MarketingHome() {
  const { data } = useSuspenseQuery(marketplaceQuery());
  const [annual, setAnnual] = useState(false);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  /** Compact merchant directory showcase — secondary to the SaaS story. */
  const directory = useMemo(() => {
    const featured = data.items.filter((item) => item.featured);
    const pool = featured.length >= 4 ? featured : data.items;
    return pool.slice(0, 4);
  }, [data.items]);

  const quickAdd = (item: CatalogItem) => {
    if (addToVendorBag(item.vendorSlug, item.id, null)) {
      setAdded((current) => ({ ...current, [item.id]: true }));
      window.setTimeout(() => setAdded((current) => ({ ...current, [item.id]: false })), 1400);
    }
  };

  return (
    <Shell>
      {/* ============ HERO — deep navy SaaS anchor ============ */}
      <section className="anchor-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-5 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="size-3.5 shrink-0" />
              Store builder for modern African merchants
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.15rem] font-semibold leading-[1.06] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.4rem]">
              Build Your Own Online Store in Minutes — No Coding Required.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Give your business a professional storefront with custom branding, instant WhatsApp
              ordering, multi-currency card payments, automated Nigeria-wide shipping rates, and
              direct bank payouts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-accent-foreground hover:bg-cyan"
              >
                Create Your Store Free <ArrowRight className="size-4 shrink-0" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-bold text-white hover:border-white/50"
              >
                See How It Works
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
              {["14-day free trial", "No card required", "Live in minutes"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 shrink-0 text-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise-delay min-w-0">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* quiet category marquee */}
      <section className="overflow-hidden border-b border-border bg-card py-3.5" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap font-display text-[11px] font-semibold tracking-[0.2em] text-muted-foreground sm:gap-12 sm:text-xs">
          {[...marqueeItems, ...marqueeItems].map((label, index) => (
            <span key={index} className="flex items-center gap-10 sm:gap-12">
              <span>{label}</span>
              <span className="text-cyan">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ============ CORE SAAS VALUE PILLARS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">Everything included from day one</p>
          <h2 className="mt-3 text-[1.85rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            A complete store, not just a page.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            NDH ShopOS bundles the storefront, checkout, logistics, marketing and payouts that
            would otherwise take five tools and a developer to stitch together.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <div className="pillar-icon">
                <pillar.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{pillar.body}</p>
              <p className="mt-4 truncate rounded-full bg-surface px-3 py-1.5 font-display text-[10px] font-semibold tracking-[0.08em] text-ink-soft">
                {pillar.proof}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="canvas-band scroll-mt-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Three steps from idea to first order.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {steps.map((step, index) => (
              <article key={step.title} className="pillar-card">
                <div className="flex items-center gap-3">
                  <span className="step-marker">{index + 1}</span>
                  <h3 className="min-w-0 text-base font-semibold sm:text-lg">{step.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-navy-2"
            >
              Launch Your Store <ArrowRight className="size-4 shrink-0" />
            </Link>
            <Link
              to="/onboarding"
              className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold hover:border-border-strong"
            >
              <Palette className="size-4 shrink-0" />
              Preview the setup flow
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-5 sm:py-20">
        <div className="text-center">
          <p className="eyebrow">Transparent SaaS pricing</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-[1.85rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            One monthly plan. Your whole store.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Every plan includes hosting, your store link, checkout and support. Start free for 14
            days, then pick the plan that fits your catalogue.
          </p>
          <div className="mt-7 inline-flex rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Annual · save 20%
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="plan-card" data-featured={Boolean(plan.popular)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{plan.desc}</p>
                </div>
                {plan.popular && (
                  <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 font-display text-[9px] font-semibold tracking-[0.1em] text-cyan">
                    POPULAR
                  </span>
                )}
              </div>
              <p className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
                {annual ? plan.annual : plan.monthly}
                <span className="text-sm font-normal text-muted-foreground">/{annual ? "year" : "month"}</span>
              </p>
              <p className="mt-1.5 text-xs font-semibold text-info">{plan.fee}</p>
              <Link
                to={plan.ctaTo}
                className={`mt-6 block w-full rounded-full px-5 py-3 text-center text-sm font-bold ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-navy-2"
                    : "border border-border bg-card hover:border-border-strong"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="mt-6 space-y-3">
                {plan.limits.map((limit) => (
                  <li key={limit} className="plan-feature">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prices in Nigerian Naira. Transaction fees apply per successful order.{" "}
          <Link to="/pricing" className="font-semibold underline underline-offset-2">
            Compare all plan limits
          </Link>
        </p>
      </section>

      {/* ============ CHECKOUT BAND ============ */}
      <section className="canvas-band border-y border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-5 sm:py-16 lg:grid-cols-[1.1fr_.9fr]">
          <div className="min-w-0">
            <p className="eyebrow">Checkout built for how Africa pays</p>
            <h2 className="mt-3 text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
              Naira at home. Dollars and pounds abroad.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Card, bank transfer and USSD for Nigerian shoppers; international card routing for
              customers abroad. Every order lands in one ledger with a WhatsApp fallback for
              customers who would rather message you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-navy-2"
              >
                Start Your Free Trial <ArrowRight className="size-4 shrink-0" />
              </Link>
              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold hover:border-border-strong"
              >
                Explore Pricing
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: CreditCard, label: "Card", meta: "NGN · USD · GBP" },
              { icon: Banknote, label: "Bank transfer", meta: "NGN" },
              { icon: MessageCircle, label: "WhatsApp order", meta: "One tap" },
              { icon: CalendarCheck, label: "USSD", meta: "NGN" },
            ].map((rail) => (
              <div key={rail.label} className="pillar-card pillar-card-compact">
                <rail.icon className="size-5 text-info" />
                <b className="mt-3 block font-display text-sm">{rail.label}</b>
                <span className="text-xs text-muted-foreground">{rail.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MERCHANT DIRECTORY (SECONDARY) ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Merchant directory</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Stores Powered by NDH ShopOS
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              A directory of independent merchant stores. Each one is its own brand, with its own
              checkout — we simply power the software behind it.
            </p>
          </div>
          <Link
            to="/catalog"
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold hover:border-border-strong"
          >
            Browse directory <ArrowRight className="size-4 shrink-0" />
          </Link>
        </div>

        {directory.length === 0 ? (
          <div className="card-porcelain mt-6 px-5 py-12 text-center">
            <Store className="mx-auto size-7 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">The directory is just opening</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Merchant stores appear here once they publish. Yours could be one of the first.
            </p>
            <Link
              to="/signup"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Start Your Free Trial
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {directory.map((item) => (
              <article key={item.id} className="pillar-card pillar-card-flush overflow-hidden">
                <Link
                  to="/store/$vendorSlug"
                  params={{ vendorSlug: item.vendorSlug }}
                  className="flex min-w-0 items-center gap-3 p-3"
                >
                  <img
                    src={item.imageUrl ?? "/hero-fashion-real.jpg"}
                    alt={`${item.vendorName} store`}
                    loading="lazy"
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0">
                    <b className="block truncate font-display text-sm">{item.vendorName}</b>
                    <span className="block truncate text-xs text-muted-foreground">{item.category}</span>
                  </span>
                </Link>
                <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
                  <span className="min-w-0 truncate text-[11px] text-muted-foreground">
                    {formatMoney(item.basePrice, item.currency)}
                  </span>
                  <button
                    onClick={() => quickAdd(item)}
                    aria-label={`Add ${item.name} from ${item.vendorName} to bag`}
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      added[item.id] ? "bg-success text-white" : "bg-primary text-primary-foreground hover:bg-navy-2"
                    }`}
                  >
                    {added[item.id] ? "✓" : <ShoppingBag className="size-3.5" />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Share2 className="size-3.5 shrink-0" />
          Selling somewhere else? Your NDH ShopOS store stays yours — bring your customers with you.
          <Link to="/catalog" className="hidden font-semibold underline underline-offset-2 sm:inline">
            <ArrowUpRight className="inline size-3" /> See the directory
          </Link>
        </p>
      </section>

      <FAQ />
    </Shell>
  );
}
