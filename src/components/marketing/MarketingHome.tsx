import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Globe2,
  Link2,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Shell } from "./SiteShell";
import { FAQ } from "./StaticPages";
import { plans } from "@/lib/plans";
import { brand, storeUrl } from "@/lib/brand";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/** Exactly four core capability pillars. */
const pillars = [
  {
    icon: Link2,
    title: "Own your brand & link",
    body: "A storefront that carries your name, logo and colours at your own address — you are never a listing inside someone else's mall.",
    proof: "ndhshopos.com/store/yourname",
    tint: "bg-[#eef4ff] text-[#175cd3]",
  },
  {
    icon: Package,
    title: "Sell anything",
    body: "Physical products with stock alerts, instant digital file downloads, plus services and appointment bookings on the same checkout.",
    proof: "Physical · Digital · Services & bookings",
    tint: "bg-[#f4f0ff] text-[#7c3aed]",
  },
  {
    icon: CreditCard,
    title: "Naira at home, global cards abroad",
    body: "Customers pay in Naira through Paystack, or in USD and GBP through Flutterwave — cards, transfers and USSD in one flow.",
    proof: "Paystack & Flutterwave",
    tint: "bg-[#e9fbf6] text-[#067647]",
  },
  {
    icon: MessageCircle,
    title: "Instant WhatsApp orders & delivery setup",
    body: "Turn a cart into a ready-to-confirm WhatsApp order, with state-by-state delivery fees and heavy cargo rates calculated up front.",
    proof: "WhatsApp orders · 36-state delivery",
    tint: "bg-[#eaf7ff] text-[#0e7490]",
  },
];

const steps = [
  {
    title: "Claim your store name",
    body: "Sign up free and reserve your address at ndhshopos.com/store/yourname in under two minutes.",
  },
  {
    title: "Add your products",
    body: "Upload physical items, digital files or bookable services, then set your delivery fees and brand colours.",
  },
  {
    title: "Share your link and get paid",
    body: "Post the link on WhatsApp, Instagram or TikTok. Orders land in your dashboard and payouts go to your bank.",
  },
];

const trustStats = [
  { value: "36", label: "States covered" },
  { value: "3", label: "Payment currencies" },
  { value: "0", label: "Lines of code" },
  { value: "2 min", label: "To go live" },
];

/** Branded demo storefront shown inside the hero phone. */
const demoStore = {
  slug: "amari-atelier",
  name: "Amari Atelier",
  category: "Wigs & beauty",
  accent: "#173f32",
  tint: "#f4efe6",
  image: "/store-preview-fashion.jpg",
  products: [
    { name: "Raw Vietnamese Wave", price: "₦185,000" },
    { name: "The Nia Bob", price: "₦98,000" },
  ],
};

/* ------------------------------------------------------------------ */
/* Hero visuals                                                        */
/* ------------------------------------------------------------------ */

/** Active mobile storefront preview — a real branded store on a phone. */
function PhoneStorefront() {
  return (
    <div className="phone-frame">
      <span className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-4" style={{ background: demoStore.tint }}>
          <span className="flex min-w-0 items-center gap-2">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-full font-display text-[9px] font-bold text-white"
              style={{ background: demoStore.accent }}
            >
              AA
            </span>
            <span className="min-w-0">
              <b className="block truncate font-display text-[11px]" style={{ color: demoStore.accent }}>
                {demoStore.name}
              </b>
              <span className="block truncate text-[9px] text-muted-foreground">{demoStore.category}</span>
            </span>
          </span>
          <span
            className="relative grid size-6 shrink-0 place-items-center rounded-full text-white"
            style={{ background: demoStore.accent }}
          >
            <ShoppingBag className="size-3" />
            <i className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent ring-2 ring-white" />
          </span>
        </div>

        <div className="relative h-28 overflow-hidden">
          <img
            src={demoStore.image}
            alt="Branded mobile storefront preview"
            className="size-full object-cover object-top"
            loading="eager"
          />
          <span className="absolute inset-x-2 bottom-2 flex flex-wrap gap-1">
            <span className="demo-chip">WhatsApp order</span>
            <span className="demo-chip">₦ Naira checkout</span>
          </span>
        </div>

        <div className="space-y-1.5 p-2.5">
          {demoStore.products.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-2 py-1.5"
            >
              <span className="min-w-0">
                <b className="block truncate text-[10px] font-semibold">{product.name}</b>
                <span className="block text-[9px] text-muted-foreground">In stock · ships in 2 days</span>
              </span>
              <span className="shrink-0 font-display text-[10px] font-bold">{product.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Clean checkout preview with Naira and WhatsApp order badges. */
function CheckoutPreview() {
  return (
    <div className="checkout-card">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <ShieldCheck className="size-3.5 shrink-0 text-success" />
          <b className="truncate font-display text-[11px]">Secure checkout</b>
        </span>
        <span className="checkout-badge bg-success-soft text-success">PAID</span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="checkout-row">
          <span className="flex min-w-0 items-center gap-1.5">
            <CreditCard className="size-3 shrink-0" />
            <span className="truncate">Card · Paystack</span>
          </span>
          <b className="shrink-0 font-display">₦185,000</b>
        </div>
        <div className="checkout-row">
          <span className="flex min-w-0 items-center gap-1.5">
            <Truck className="size-3 shrink-0" />
            <span className="truncate">Delivery · Lagos</span>
          </span>
          <b className="shrink-0 font-display">₦2,500</b>
        </div>
        <div className="checkout-row">
          <span className="flex min-w-0 items-center gap-1.5">
            <Globe2 className="size-3 shrink-0" />
            <span className="truncate">USD · GBP routing</span>
          </span>
          <span className="checkout-badge bg-info-soft text-info">FLUTTERWAVE</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="checkout-badge bg-[#e7f8ee] text-[#0b7a4b]">
          <MessageCircle className="size-3" /> WhatsApp order
        </span>
        <span className="checkout-badge bg-surface text-ink-soft">
          <Banknote className="size-3" /> Transfer · USSD
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-primary px-2.5 py-2 text-white">
        <span className="truncate font-display text-[10px] font-semibold tracking-[0.08em]">TOTAL · NGN</span>
        <b className="shrink-0 font-display text-[11px]">₦187,500</b>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page — five high-impact sections                                    */
/* ------------------------------------------------------------------ */

export function MarketingHome() {
  const [annual, setAnnual] = useState(false);

  return (
    <Shell>
      {/* ============================================================
          1 · HERO — real photography under a deep navy wash
          ============================================================ */}
      <section className="hero-field">
        <img
          src="/hero-fashion-real.jpg"
          alt=""
          aria-hidden="true"
          className="hero-field-image"
          loading="eager"
          fetchPriority="high"
        />
        <div className="hero-field-overlay" aria-hidden="true" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="size-3.5 shrink-0" />
              Store builder for modern African merchants
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.1rem] font-semibold leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.35rem]">
              Build Your Own Online Store in Minutes — No Coding Required.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Custom branding, instant WhatsApp ordering, multi-currency card payments, automated
              Nigeria-wide shipping and direct bank payouts — all in one subscription.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-accent-foreground hover:bg-cyan"
              >
                Start Free Trial <ArrowRight className="size-4 shrink-0" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 font-bold text-white hover:border-white/60"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 shrink-0 text-cyan" /> 14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 shrink-0 text-cyan" /> No card required
              </span>
            </p>

            {/* trust stats */}
            <div className="hero-stats mt-9">
              {trustStats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* mobile storefront + checkout previews */}
          <div className="animate-rise-delay grid min-w-0 gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center sm:gap-5">
            <PhoneStorefront />
            <CheckoutPreview />
          </div>
        </div>
      </section>

      {/* ============================================================
          2 · CORE CAPABILITIES — four pillars
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Everything included</p>
          <h2 className="mt-3 text-[1.8rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem]">
            A complete store, not just a page.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            The storefront, checkout, delivery and payouts a growing business needs — without five
            tools and a developer to stitch them together.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${pillar.tint}`}>
                <pillar.icon className="size-5" />
              </span>
              <h3 className="mt-6 text-lg font-semibold sm:text-xl">{pillar.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{pillar.body}</p>
              <p className="mt-5 w-fit max-w-full truncate rounded-full bg-surface px-3 py-1.5 font-display text-[10px] font-semibold tracking-[0.04em] text-ink-soft">
                {pillar.proof}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================
          3 · HOW IT WORKS — three steps
          ============================================================ */}
      <section id="how-it-works" className="canvas-band scroll-mt-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem]">
              Live in three simple steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => (
              <article key={step.title} className="pillar-card">
                <div className="flex items-center gap-3">
                  <span className="step-marker">{index + 1}</span>
                  <span className="font-display text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
                    STEP {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground hover:bg-navy-2"
            >
              Start Free Trial <ArrowRight className="size-4 shrink-0" />
            </Link>
            <a
              href="#pricing"
              className="flex items-center justify-center rounded-full border border-border bg-card px-7 py-3.5 text-sm font-bold hover:border-border-strong"
            >
              See plans
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          4 · PRICING — Free, Starter, Growth
          ============================================================ */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple pricing</p>
          <h2 className="mt-3 text-[1.8rem] font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem]">
            Start free. Upgrade when you grow.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Every plan includes hosting, your store link, checkout and support. No setup fees, no
            hidden listing charges.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Yearly · save 20%
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="plan-card" data-featured={Boolean(plan.popular)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.desc}</p>
                </div>
                {plan.popular && (
                  <span className="shrink-0 rounded-full bg-primary px-3 py-1 font-display text-[9px] font-semibold tracking-[0.1em] text-cyan">
                    POPULAR
                  </span>
                )}
              </div>
              <p className="mt-7 font-display text-3xl font-semibold sm:text-4xl">
                {annual ? plan.annual : plan.monthly}
                <span className="text-sm font-normal text-muted-foreground">/{annual ? "year" : "month"}</span>
              </p>
              <p className="mt-2 text-xs font-semibold text-info">{plan.fee}</p>
              <Link
                to={plan.ctaTo}
                className={`mt-7 block w-full rounded-full px-5 py-3.5 text-center text-sm font-bold ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-navy-2"
                    : "border border-border bg-card hover:border-border-strong"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="mt-7 space-y-3.5">
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

        <p className="mt-8 text-center text-xs leading-6 text-muted-foreground">
          Prices in Nigerian Naira, excluding per-order transaction fees.{" "}
          <Link to="/pricing" className="font-semibold underline underline-offset-2">
            Compare every plan limit
          </Link>
        </p>
      </section>

      {/* ============================================================
          5 · FAQ + FINAL CALL TO ACTION
          ============================================================ */}
      <FAQ />

      <section className="px-4 pb-16 pt-4 sm:px-6 sm:pb-24">
        <div className="hero-field mx-auto max-w-7xl rounded-[2rem] px-6 py-14 text-center sm:px-16 sm:py-20">
          <img src="/hero-digital-real.jpg" alt="" aria-hidden="true" className="hero-field-image" loading="lazy" />
          <div className="hero-field-overlay" aria-hidden="true" />
          <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/20 bg-white/10 text-cyan">
            <Star className="size-5" />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[2.75rem]">
            Your store can be live today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Join the merchants selling on {brand.name}. Start free for 14 days — no card, no code,
            no complicated setup.
          </p>
          <div className="mx-auto mt-9 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-accent-foreground hover:bg-cyan"
            >
              Start Free Trial <ArrowRight className="size-4 shrink-0" />
            </Link>
            <Link
              to="/pricing"
              className="flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-bold text-white hover:border-white/60"
            >
              Explore Pricing
            </Link>
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/45">
            <span className="flex items-center gap-1.5">
              <Smartphone className="size-3.5 shrink-0" /> Mobile-first storefronts
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 shrink-0" /> Secure payouts
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="size-3.5 shrink-0" /> Multi-currency ready
            </span>
          </p>
        </div>
      </section>
    </Shell>
  );
}
