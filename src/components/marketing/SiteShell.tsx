import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { EstStoreLockup, GatewayMark } from "@/components/brand/GatewayMark";
import { getAuthState } from "@/lib/auth";
import { useCartBadge } from "@/lib/usePersistentCart";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="NDH eStore home">
      <EstStoreLockup size={38} />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Header — strictly commerce                                          */
/* ------------------------------------------------------------------ */

function CartTrigger({ className = "" }: { className?: string }) {
  const badge = useCartBadge();
  return (
    <Link
      {...(badge.lastSlug
        ? { to: "/store/$vendorSlug" as const, params: { vendorSlug: badge.lastSlug }, search: { bag: 1 } }
        : { to: "/catalog" as const })}
      aria-label={`Open your bag, ${badge.total} items`}
      className={`relative grid size-10 place-items-center rounded-full border border-border bg-card text-ink-soft hover:border-border-strong hover:text-foreground ${className}`}
    >
      <ShoppingBag className="size-[18px]" />
      {badge.total > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 font-display text-[10px] font-semibold text-accent">
          {badge.total > 99 ? "99+" : badge.total}
        </span>
      )}
    </Link>
  );
}

function SearchBox({ className = "", autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const [term, setTerm] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const query = term.trim();
    window.location.href = query ? `/catalog?q=${encodeURIComponent(query)}` : "/catalog";
  };
  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        autoFocus={autoFocus}
        placeholder="Search products, stores, categories"
        aria-label="Search the marketplace"
        className="field h-10 rounded-full pl-10 pr-4"
      />
    </form>
  );
}

const commerceLinks = [
  { to: "/catalog", label: "Catalog", hash: undefined as string | undefined },
  { to: "/catalog", label: "Categories", hash: "categories" as string | undefined },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: auth } = useQuery({ queryKey: ["auth-state"], queryFn: () => getAuthState(), staleTime: 30_000 });
  const signedIn = Boolean(auth?.user);
  const cart = useCartBadge();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-[4.5rem] sm:px-5">
          <Logo />
          <nav className="ml-6 hidden items-center gap-6 lg:flex" aria-label="Commerce">
            {commerceLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={link.hash}
                className="text-sm font-semibold text-ink-soft hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <SearchBox className="ml-auto hidden w-64 md:block xl:w-80" />
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <CartTrigger />
            <Link
              to="/dashboard"
              className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:border-border-strong hover:text-foreground sm:inline-flex"
            >
              <Store className="size-4" />
              {signedIn ? "Dashboard" : "Merchant portal"}
            </Link>
            <Link
              to={signedIn ? "/dashboard" : "/signin"}
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-navy-2 lg:inline-flex"
            >
              {signedIn ? "Open workspace" : "Sign in"}
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              className="grid size-10 place-items-center rounded-full border border-border bg-card lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-primary/55 backdrop-blur-sm"
          />
          <aside className="animate-rise absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <SearchBox className="mt-8" autoFocus />
            <nav className="mt-6 space-y-1" aria-label="Commerce">
              {commerceLinks.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.to}
                  hash={link.hash}
                  className="flex items-center justify-between border-b border-border py-4 text-xl font-semibold"
                >
                  <span>
                    <small className="mr-4 font-display text-xs text-muted-foreground">0{index + 1}</small>
                    {link.label}
                  </span>
                  <ArrowRight className="size-5" />
                </Link>
              ))}
              <Link
                {...(cart.lastSlug
                  ? { to: "/store/$vendorSlug" as const, params: { vendorSlug: cart.lastSlug }, search: { bag: 1 } }
                  : { to: "/catalog" as const })}
                className="flex items-center justify-between border-b border-border py-4 text-xl font-semibold"
              >
                <span>
                  <small className="mr-4 font-display text-xs text-muted-foreground">03</small>
                  Your bag
                  {cart.total > 0 && (
                    <span className="ml-3 rounded-full bg-muted px-2.5 py-1 font-display text-xs font-semibold text-foreground">
                      {cart.total}
                    </span>
                  )}
                </span>
                <ShoppingBag className="size-5" />
              </Link>
            </nav>
            <div className="mt-auto space-y-3">
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 rounded-full border border-border py-3.5 font-bold"
              >
                <Store className="size-4" />
                Merchant portal
              </Link>
              <Link
                to={signedIn ? "/dashboard" : "/signup"}
                className="block rounded-full bg-primary py-3.5 text-center font-bold text-primary-foreground"
              >
                {signedIn ? "Open workspace" : "Start selling"}
              </Link>
              <div className="flex justify-center gap-5 pt-4 text-xs text-muted-foreground">
                <Link to="/privacy">Privacy</Link>
                <Link to="/terms">Terms</Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — deep navy, restrained family directory                     */
/* ------------------------------------------------------------------ */

const familyDirectory = [
  { label: "ndh.com.ng", href: "https://ndh.com.ng", note: "Parent" },
  { label: "NDH Agency", href: "https://ndh.com.ng/agency", note: "Build" },
  { label: "NDH Academy", href: "https://ndh.com.ng/academy", note: "Learn" },
  { label: "AgriCapital", href: "https://ndh.com.ng", note: "Grow" },
];

export function SiteFooter() {
  return (
    <footer className="anchor-navy">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_.9fr]">
        <div>
          <span className="on-navy flex items-center">
            <EstStoreLockup size={44} onNavy />
          </span>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
            Commerce infrastructure for ambitious African merchants: storefronts,
            WhatsApp-first ordering, per-state delivery pricing and
            multi-currency card rails — engineered as one calm operating system.
          </p>
          <div className="mt-6 space-y-2 text-sm text-white/70">
            <a className="flex items-center gap-2 hover:text-white" href="mailto:admin@ndh.com.ng">
              <Mail className="size-4 text-cyan" />
              admin@ndh.com.ng
            </a>
            <a className="flex items-center gap-2 hover:text-white" href="tel:+2349029932794">
              <Phone className="size-4 text-cyan" />
              0902 993 2794
            </a>
          </div>
        </div>

        <nav aria-label="Shopping and products">
          <h2 className="eyebrow on-navy">Shopping</h2>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            <Link className="block hover:text-white" to="/catalog">Catalog</Link>
            <Link className="block hover:text-white" to="/catalog" hash="categories">Categories</Link>
            <CartLinkFooter />
            <Link className="block hover:text-white" to="/track">Order tracking</Link>
          </div>
        </nav>

        <nav aria-label="Merchants">
          <h2 className="eyebrow on-navy">Merchants</h2>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            <Link className="block hover:text-white" to="/signup">Open a store</Link>
            <Link className="block hover:text-white" to="/pricing">Vendor pricing</Link>
            <Link className="block hover:text-white" to="/dashboard">Dashboard</Link>
            <Link className="block hover:text-white" to="/help">Support</Link>
          </div>
        </nav>

        <nav aria-label="Najeeb Digital Hub family" className="text-white/45">
          <h2 className="eyebrow on-navy !text-white/40">NDH family</h2>
          <div className="mt-5 space-y-3 text-[13px]">
            {familyDirectory.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center justify-between gap-2 hover:text-white/80"
              >
                {item.label}
                <ArrowUpRight className="size-3" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-[11px] leading-5 text-white/35">
            A commerce subsidiary of Najeeb Digital Hub.
          </p>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-white/45">
          <span>© 2026 Najeeb Digital Hub. All rights reserved.</span>
          <nav aria-label="Legal" className="flex gap-5">
            <Link className="hover:text-white/80" to="/terms">Terms</Link>
            <Link className="hover:text-white/80" to="/privacy">Privacy</Link>
            <Link className="hover:text-white/80" to="/cookies">Cookies</Link>
          </nav>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-8 text-xs text-white/40">
          <p className="flex items-center gap-2">
            <GatewayMark size={16} sector={false} />
            Rooted in Sokoto. Engineered for global commerce by Najeeb Digital Hub.
          </p>
        </div>
      </div>
    </footer>
  );
}

function CartLinkFooter() {
  const badge = useCartBadge();
  return (
    <Link
      className="flex items-center gap-2 hover:text-white"
      {...(badge.lastSlug
        ? { to: "/store/$vendorSlug" as const, params: { vendorSlug: badge.lastSlug }, search: { bag: 1 } }
        : { to: "/catalog" as const })}
    >
      Cart
      {badge.total > 0 && (
        <span className="rounded-full bg-white/10 px-2 py-0.5 font-display text-[10px] font-semibold text-cyan">
          {badge.total}
        </span>
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Page scaffolding                                                    */
/* ------------------------------------------------------------------ */

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="anchor-navy border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{description}</p>
        {children}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="px-5 py-20">
      <div className="anchor-navy mx-auto max-w-7xl rounded-[2rem] px-7 py-16 text-center sm:px-16">
        <p className="eyebrow">Your next chapter</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
          Your global store can be live today.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/60">
          Start free for 14 days. No card required, no coding, no complicated setup.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/signup"
            className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground hover:bg-cyan"
          >
            Start building <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/book-call"
            className="rounded-full border border-white/25 px-6 py-3 font-bold text-white hover:border-white/50"
          >
            Talk to an expert
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main>
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  );
}
