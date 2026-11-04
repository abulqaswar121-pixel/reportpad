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
import { brand } from "@/lib/brand";
import { getAuthState } from "@/lib/auth";
import { useCartBadge } from "@/lib/usePersistentCart";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export function Logo() {
  return (
    <Link to="/" className="flex min-w-0 items-center" aria-label={`${brand.name} home`}>
      <EstStoreLockup size={38} />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Header — strictly commerce                                          */
/* ------------------------------------------------------------------ */

/**
 * Quiet store-directory search. Opens the merchant directory (/catalog),
 * which is a discovery surface — not the platform's primary purpose.
 */
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
        placeholder="Find a store"
        aria-label="Search stores powered by NDH ShopOS"
        className="field h-10 rounded-full pl-10 pr-4"
      />
    </form>
  );
}

/**
 * Primary SaaS navigation. The merchant directory (/catalog) is included as a
 * secondary "Discover stores" link — never the main focus of the header.
 */
const productLinks = [
  { to: "/features", label: "Product", hash: undefined as string | undefined },
  { to: "/pricing", label: "Pricing", hash: undefined as string | undefined },
  { to: "/catalog", label: "Discover stores", hash: undefined as string | undefined },
  { to: "/help", label: "Resources", hash: undefined as string | undefined },
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
          <nav className="ml-5 hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Platform">
            {productLinks.map((link) => (
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
          <SearchBox className="ml-auto hidden w-52 xl:block" />
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <Link
              to={signedIn ? "/dashboard" : "/signin"}
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink-soft hover:text-foreground lg:inline-flex"
            >
              {signedIn ? "Workspace" : "Log in"}
            </Link>
            <Link
              to={signedIn ? "/dashboard" : "/signup"}
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-navy-2 sm:hidden"
            >
              {signedIn ? "Workspace" : "Start free"}
            </Link>
            <Link
              to={signedIn ? "/dashboard" : "/signup"}
              className="hidden whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-navy-2 sm:inline-flex"
            >
              {signedIn ? "Open workspace" : "Start free trial"}
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
            <nav className="mt-6 space-y-1" aria-label="Platform">
              {productLinks.map((link, index) => (
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
              {cart.total > 0 && (
                <Link
                  {...(cart.lastSlug
                    ? { to: "/store/$vendorSlug" as const, params: { vendorSlug: cart.lastSlug }, search: { bag: 1 } }
                    : { to: "/catalog" as const })}
                  className="flex items-center justify-between border-b border-border py-4 text-xl font-semibold"
                >
                  <span>
                    <small className="mr-4 font-display text-xs text-muted-foreground">05</small>
                    Your bag
                    <span className="ml-3 rounded-full bg-muted px-2.5 py-1 font-display text-xs font-semibold text-foreground">
                      {cart.total}
                    </span>
                  </span>
                  <ShoppingBag className="size-5" />
                </Link>
              )}
            </nav>
            <div className="mt-auto space-y-3">
              <Link
                to={signedIn ? "/dashboard" : "/signin"}
                className="flex items-center justify-center gap-2 rounded-full border border-border py-3.5 font-bold"
              >
                <Store className="size-4" />
                {signedIn ? "Open workspace" : "Log in"}
              </Link>
              <Link
                to={signedIn ? "/dashboard" : "/signup"}
                className="block rounded-full bg-primary py-3.5 text-center font-bold text-primary-foreground"
              >
                {signedIn ? "Open workspace" : "Start free trial"}
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
/* Footer — deep navy, parent-ecosystem attribution + directory        */
/* ------------------------------------------------------------------ */

const familyDirectory = [
  { label: "ndhnet.com", href: brand.parent.url, note: "Parent" },
  { label: "NDH Agency", href: "https://ndhnet.com", note: "Build" },
  { label: "NDH Academy", href: "https://ndhnet.com", note: "Learn" },
  { label: "AgriCapital", href: "https://ndhnet.com", note: "Grow" },
];

const platformFooterLinks = [
  { label: "Features", to: "/features" as const },
  { label: "Pricing", to: "/pricing" as const },
  { label: "Start free trial", to: "/signup" as const },
  { label: "Help centre", to: "/help" as const },
];

const merchantFooterLinks = [
  { label: "Merchant dashboard", to: "/dashboard" as const },
  { label: "Track an order", to: "/track" as const },
  { label: "Book a demo call", to: "/book-call" as const },
  { label: "Contact support", to: "/contact" as const },
];

export function SiteFooter() {
  return (
    <footer className="anchor-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-5 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_.95fr]">
        <div className="min-w-0">
          <span className="on-navy flex items-center">
            <EstStoreLockup size={44} onNavy />
          </span>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">{brand.tagline}</p>
          <a
            href={brand.parent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="parent-link mt-6"
          >
            <ArrowUpRight className="size-3.5 shrink-0" />
            <span className="min-w-0 truncate">{brand.parent.legalNote}</span>
          </a>
          <div className="mt-6 space-y-2 text-sm text-white/70">
            <a className="flex items-center gap-2 hover:text-white" href={`mailto:${brand.support.email}`}>
              <Mail className="size-4 shrink-0 text-cyan" />
              <span className="break-all">{brand.support.email}</span>
            </a>
            <a className="flex items-center gap-2 hover:text-white" href={`tel:${brand.support.phoneHref}`}>
              <Phone className="size-4 shrink-0 text-cyan" />
              {brand.support.phone}
            </a>
          </div>
        </div>

        <nav aria-label="Platform">
          <h2 className="eyebrow on-navy">Platform</h2>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            {platformFooterLinks.map((item) => (
              <Link key={item.label} className="block hover:text-white" to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label="Merchants">
          <h2 className="eyebrow on-navy">Merchants</h2>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            {merchantFooterLinks.map((item) => (
              <Link key={item.label} className="block hover:text-white" to={item.to}>
                {item.label}
              </Link>
            ))}
            <Link className="block hover:text-white" to="/catalog">
              Discover stores
            </Link>
          </div>
        </nav>

        <nav aria-label="Najeeb Digital Hub family" className="min-w-0 text-white/45">
          <h2 className="eyebrow on-navy opacity-70">NDH family</h2>
          <div className="mt-5 space-y-3 text-[13px]">
            {familyDirectory.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 hover:text-white/80"
              >
                <span className="truncate">{item.label}</span>
                <ArrowUpRight className="size-3 shrink-0" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-[11px] leading-5 text-white/35">
            NDH ShopOS is a member of the Najeeb Digital Hub product family.
          </p>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/45 sm:px-5 md:flex-row md:items-center md:justify-between">
          <span className="min-w-0">
            © 2026 Najeeb Digital Hub. NDH ShopOS is a product of Najeeb Digital Hub.
          </span>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            <Link className="hover:text-white/80" to="/terms">
              Terms
            </Link>
            <Link className="hover:text-white/80" to="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-white/80" to="/cookies">
              Cookies
            </Link>
          </nav>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 pb-8 text-xs text-white/40 sm:px-5">
          <GatewayMark size={16} sector={false} />
          <span className="min-w-0">
            Store builder and commerce operating system, made for African merchants by{" "}
            <a
              href={brand.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/25 underline-offset-2 hover:text-white/80"
            >
              Najeeb Digital Hub
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
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
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold text-white sm:text-5xl">
          Your store can be live today.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
          Start your 14-day free trial. No card required, no coding, no complicated setup.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground hover:bg-cyan"
          >
            Create Your Store Free <ArrowRight className="size-4 shrink-0" />
          </Link>
          <Link
            to="/catalog"
            className="flex items-center justify-center rounded-full border border-white/25 px-6 py-3 font-bold text-white hover:border-white/50"
          >
            View Live Demo Store
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
