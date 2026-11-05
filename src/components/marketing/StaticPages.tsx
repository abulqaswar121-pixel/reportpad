import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  Link2,
  LockKeyhole,
  MapPinned,
  Mail,
  MessageCircle,
  Package,
  Palette,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui/primitives";
import { brand } from "@/lib/brand";
import { planComparison, plans } from "@/lib/plans";
import { CTA, PageHero, Shell } from "./SiteShell";

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const featureData = [
  [Link2, "Your own store link", "Every merchant gets a branded address at ndhshopos.com/store/yourbrand, plus logo, banner and colour controls."],
  [Palette, "Design without code", "Guided setup and Design DNA presets let you publish a storefront that looks like your brand, not a template."],
  [Package, "Sell anything", "Physical goods with inventory alerts, instant digital downloads, services and calendar booking products."],
  [Truck, "Nigeria-wide delivery rates", "State-by-state shipping calculator with delivery windows and heavy cargo handling for bulky orders."],
  [CreditCard, "Multi-currency checkout", "Naira, USD and GBP by card, bank transfer or USSD — with a one-tap WhatsApp order fallback."],
  [MessageCircle, "WhatsApp ordering", "Customers send a structured order brief with items, delivery zone and total to your active WhatsApp line."],
  [Wallet, "Fast seller payouts", "An automated earnings ledger, saved bank accounts and verified withdrawal requests in your dashboard."],
  [BarChart3, "Growth tooling", "Meta Pixel and server-side ad conversion tracking, real-time order tracking and Nia, the AI care assistant."],
  [ShieldCheck, "Your data stays yours", "Vendor isolation is enforced at the database layer, so your customers, ledger and inventory remain private."],
] as const;

export function FeaturesPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="THE STORE BUILDER PLATFORM"
        title={
          <>
            Everything your store needs, <span className="text-cyan">already included.</span>
          </>
        }
        description="One subscription covers the storefront, checkout, logistics, marketing and payouts. No plugins, no developer, no hosting bill."
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-accent-foreground hover:bg-cyan"
          >
            Start Your Free Trial <ArrowRight className="size-4 shrink-0" />
          </Link>
          <Link
            to="/pricing"
            className="flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-bold text-white hover:border-white/50"
          >
            Explore Pricing
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featureData.map(([Icon, title, text]) => (
            <article key={title} className="pillar-card">
              <div className="pillar-icon">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="canvas-band border-y border-border px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="min-w-0">
            <Badge>BUILT FOR YOUR BUSINESS</Badge>
            <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-4xl">
              Not another one-size-fits-all website builder.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              NDH ShopOS changes its tools based on how your business actually operates — from wig
              lengths and lace variants to cargo mass and tour capacity.
            </p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {["Fashion & beauty", "Grocery & food", "Cargo & logistics", "Travel & tours", "Digital products", "Freelance services"].map((x) => (
                <div key={x} className="flex items-center gap-2 rounded-xl bg-card p-3 text-sm">
                  <Check className="size-4 shrink-0 text-info" />
                  {x}
                </div>
              ))}
            </div>
          </div>
          <img
            src="/store-preview-logistics.jpg"
            className="min-w-0 rounded-2xl shadow-2xl"
            alt="NDH ShopOS merchant storefront example"
            loading="lazy"
          />
        </div>
      </section>

      <CTA />
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export function PricingPage() {
  const [annual, setAnnual] = useState(false);
  return (
    <Shell>
      <PageHero
        eyebrow="PRICING"
        title={
          <>
            One plan. <span className="text-cyan">Your whole store.</span>
          </>
        }
        description="Every plan includes hosting, your store link, checkout and support. Start free for 14 days — no card required."
      >
        <div className="mt-8 inline-flex rounded-full border border-white/20 bg-white/5 p-1">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${!annual ? "bg-white text-primary" : "text-white/70"}`}
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${annual ? "bg-white text-primary" : "text-white/70"}`}
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
          >
            Yearly · save 20%
          </button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="plan-card" data-featured={Boolean(plan.popular)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
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

        {/* Comparison strip — horizontal scroll on small screens */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold sm:text-2xl">Compare plan limits</h2>
          <div className="scroll-x mt-5 rounded-xl border border-border bg-card">
            <table className="data-table min-w-[560px]">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th>Starter</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {planComparison.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={index} className={index === 0 ? "font-semibold text-foreground" : "num"}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs leading-6 text-muted-foreground">
          All prices are in Nigerian Naira and exclude transaction fees charged per successful order.
          Subscription payments are billed monthly or annually through approved payment providers.
        </p>
      </section>

      <FAQ />
      <CTA />
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const faqs = [
  [
    "Do I need a developer to build my store?",
    "No. Setup is a guided flow: name your business, claim your store link, add products and pick your colours. Most merchants publish within an hour.",
  ],
  [
    "Is NDH ShopOS a marketplace?",
    "No. You get your own independent store and brand. Our merchant directory is only an optional discovery listing — your customers buy from your store, not from a shared mall page.",
  ],
  [
    "How do customers pay me?",
    "Every store accepts Naira by card, bank transfer and USSD, plus one-tap WhatsApp orders. Growth stores can also price and accept USD and GBP by card.",
  ],
  [
    "How does delivery pricing work?",
    "You define delivery fees per Nigerian state with their own delivery windows. Shoppers see the exact charge at checkout — including heavy cargo handling for bulky items.",
  ],
  [
    "When do I get paid?",
    "Paid orders post to your earnings ledger automatically. Add your bank account in the dashboard and request a verified withdrawal whenever you like.",
  ],
  [
    "Can I use my own domain?",
    "Custom domain configuration is available on the Growth plan. Every plan, including Free, includes an ndhshopos.com store link out of the box.",
  ],
  [
    "What happens after my free trial?",
    "You pick the plan that fits your catalogue. Nothing is charged until the trial ends, and you keep your store, products and settings either way.",
  ],
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="canvas-band border-y border-border px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow text-center">Questions, answered</p>
        <h2 className="mt-3 text-center text-2xl font-semibold sm:text-4xl">Frequently asked questions</h2>
        <div className="mt-9 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <button
              key={f[0]}
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="w-full py-5 text-left"
            >
              <span className="flex items-start justify-between gap-4 font-semibold">
                <span className="min-w-0">{f[0]}</span>
                <ChevronDown className={`mt-1 size-4 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
              </span>
              {open === i && <p className="mt-3 pr-4 text-sm leading-7 text-muted-foreground sm:pr-8">{f[1]}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="A PRODUCT OF NAJEEB DIGITAL HUB"
        title={
          <>
            African ambition. <span className="text-cyan">Global infrastructure.</span>
          </>
        }
        description={brand.tagline}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-5 sm:py-20 lg:grid-cols-2">
        <img
          src="/hero-digital-real.jpg"
          className="min-h-64 w-full rounded-2xl object-cover"
          alt="Merchants building their stores with NDH ShopOS"
          loading="lazy"
        />
        <div className="min-w-0">
          <Badge>OUR MISSION</Badge>
          <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-4xl">
            Make world-class commerce accessible to every serious merchant.
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            NDH ShopOS is built by Najeeb Digital Hub in Nigeria. It brings storefront design,
            payments, logistics, marketing and operations together, so merchants can spend less time
            managing disconnected tools and more time selling.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Our business is simple: sellers pay a monthly or annual subscription to create, host and
            run their own store. No marketplace gatekeeping, no hidden listing fees.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Nigeria", "Built here"],
              ["Global", "Payment ready"],
              ["Independent", "Your own brand"],
            ].map((x) => (
              <Card key={x[0]} className="p-4">
                <b className="font-display text-sm">{x[0]}</b>
                <p className="text-xs text-muted-foreground">{x[1]}</p>
              </Card>
            ))}
          </div>
          <a
            href={brand.parent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"
          >
            Visit Najeeb Digital Hub
            <ArrowRight className="size-4 shrink-0" />
          </a>
        </div>
      </section>
      <CTA />
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export function ContactPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="CONTACT"
        title="Let’s talk about your next stage."
        description="Sales, onboarding, billing or technical support — our team will point you in the right direction."
      />
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-16 sm:px-5 sm:py-20 lg:grid-cols-2">
        <Card className="min-w-0 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Send a message</h2>
          <div className="mt-6 grid gap-4">
            <Input placeholder="Full name" />
            <Input type="email" placeholder="Business email" />
            <Input placeholder="WhatsApp number" />
            <select className="field">
              <option>Sales enquiry</option>
              <option>Onboarding help</option>
              <option>Billing & plans</option>
              <option>Partnership</option>
            </select>
            <textarea className="field h-32" placeholder="How can we help?" />
            <Button>Send enquiry</Button>
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-6">
            <Mail className="size-5" />
            <h3 className="mt-4 text-lg font-semibold">Email us</h3>
            <a href={`mailto:${brand.support.email}`} className="mt-1 block break-all text-sm text-muted-foreground">
              {brand.support.email}
            </a>
          </Card>
          <Card className="p-6">
            <MessageCircle className="size-5" />
            <h3 className="mt-4 text-lg font-semibold">Call or WhatsApp</h3>
            <a href={`https://wa.me/${brand.support.whatsapp}`} className="mt-1 block text-sm text-muted-foreground">
              {brand.support.phone}
            </a>
          </Card>
          <Card className="p-6">
            <MapPinned className="size-5" />
            <h3 className="mt-4 text-lg font-semibold">Based in Nigeria</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Serving merchants across Africa and the world. NDH ShopOS is a Product of{" "}
              <a href={brand.parent.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                Najeeb Digital Hub
              </a>
              .
            </p>
          </Card>
        </div>
      </section>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Auth helper page                                                    */
/* ------------------------------------------------------------------ */

export function SignInPage() {
  return (
    <Shell>
      <section className="canvas-band grid min-h-[75vh] place-items-center px-4 py-16">
        <Card className="w-full max-w-md p-7 shadow-2xl sm:p-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary">
            <LockKeyhole />
          </div>
          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">Welcome back.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your NDH ShopOS store.</p>
          <label className="mt-7 block text-sm font-bold">
            Email
            <Input type="email" className="mt-2" />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Password
            <Input type="password" className="mt-2" />
          </label>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/reset-password" className="font-bold">
              Forgot password?
            </Link>
          </div>
          <Link to="/dashboard" className="mt-6 block rounded-full bg-primary py-3 text-center font-bold text-primary-foreground">
            Sign in
          </Link>
          <p className="mt-6 text-center text-sm">
            New to NDH ShopOS?{" "}
            <Link to="/signup" className="font-bold underline">
              Start free
            </Link>
          </p>
        </Card>
      </section>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Book a call                                                         */
/* ------------------------------------------------------------------ */

export function BookCallPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="SCOPING CALL"
        title="Launch your store with a plan."
        description="Book a focused 30-minute conversation about your catalogue, delivery needs and the right ShopOS plan."
      />
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-14 sm:px-5 sm:py-16 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <Calendar className="size-7" />
          <h2 className="mt-5 text-xl font-semibold sm:text-2xl">What we’ll cover</h2>
          {[
            "Your business model and customers",
            "Products, downloads or booking flow",
            "Payments and delivery requirements",
            "The right ShopOS plan and launch path",
          ].map((x) => (
            <p key={x} className="mt-4 flex gap-3 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
              {x}
            </p>
          ))}
        </Card>
        <Card className="min-w-0 p-6 sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Request your call</h2>
          <div className="mt-6 space-y-4">
            <Input placeholder="Your name" />
            <Input type="email" placeholder="Business email" />
            <Input placeholder="WhatsApp number" />
            <Input type="date" />
            <select className="field">
              <option>10:00 AM WAT</option>
              <option>12:00 PM WAT</option>
              <option>2:00 PM WAT</option>
              <option>4:00 PM WAT</option>
            </select>
            <Button className="w-full">Request appointment</Button>
          </div>
        </Card>
      </section>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Help centre                                                         */
/* ------------------------------------------------------------------ */

export function HelpPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="HELP CENTRE"
        title="Answers for every stage."
        description="Explore setup guidance or contact the team when you need a human."
      >
        <div className="mx-auto mt-8 max-w-xl">
          <Input placeholder="Search guides and answers…" className="shadow-xl" />
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 sm:px-5 sm:py-20 md:grid-cols-3">
        {[
          ["Getting started", "Account, onboarding and first publish"],
          ["Products & fulfilment", "Products, orders, variants and delivery"],
          ["Payments & billing", "Transactions, subscriptions and payouts"],
          ["Store design", "Design DNA, navigation and branding"],
          ["Marketing tools", "Meta catalogue, Pixel and ad tracking"],
          ["Privacy & security", "Data ownership and account safety"],
        ].map((x) => (
          <Link key={x[0]} to="/contact">
            <Card className="h-full p-5 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-base font-semibold">{x[0]}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{x[1]}</p>
              <p className="mt-5 flex items-center gap-1.5 text-sm font-bold">
                Explore <ArrowRight className="size-3.5" />
              </p>
            </Card>
          </Link>
        ))}
      </section>
      <FAQ />
    </Shell>
  );
}
