import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PackageSearch, Plus, ShoppingBag, Store } from "lucide-react";
import { CTA, Shell } from "@/components/marketing/SiteShell";
import { marketplaceQuery, formatMoney, type CatalogItem } from "@/lib/marketplace";
import { addToVendorBag } from "@/lib/usePersistentCart";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: pageMeta({
      title: "Catalog — shop every NDH eStore merchant | NDH eStore",
      description:
        "Browse live products across every published NDH eStore merchant: fashion, grocery, wholesale, cargo and digital businesses with transparent prices.",
    }),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(marketplaceQuery()),
  component: CatalogPage,
});

function CatalogPage() {
  const { data } = useSuspenseQuery(marketplaceQuery());
  const search = Route.useSearch({ select: (s) => String((s as { q?: string }).q ?? "") });
  const [term, setTerm] = useState(search);
  const [category, setCategory] = useState("All");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const items = useMemo(() => {
    const q = term.trim().toLowerCase();
    return data.items.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const inSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.vendorName.toLowerCase().includes(q);
      return inCategory && inSearch;
    });
  }, [data.items, term, category]);

  const quickAdd = (item: CatalogItem) => {
    if (addToVendorBag(item.vendorSlug, item.id, null)) {
      setAdded((current) => ({ ...current, [item.id]: true }));
      window.setTimeout(
        () => setAdded((current) => ({ ...current, [item.id]: false })),
        1400,
      );
    }
  };

  return (
    <Shell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Marketplace</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                The catalog
              </h1>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Every product published by live NDH eStore merchants, with
                transparent pricing from the source store.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <PackageSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search products, categories, stores"
                aria-label="Search the catalog"
                className="field h-12 rounded-full pl-11 pr-5"
              />
            </div>
          </div>
          {!data.configured && (
            <p className="mt-6 rounded-xl border border-border bg-surface px-4 py-3 text-xs text-muted-foreground">
              Showing the sample catalog. Live merchant inventory appears once
              this deployment is connected to its Supabase backend.
            </p>
          )}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-10 sm:px-5">
        <div className="scroll-x flex gap-2 pb-2">
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

        <div className="mt-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {category === "All" ? "Everything" : category}
          </h2>
          <span className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "product" : "products"} ·{" "}
            {data.stores} {data.stores === 1 ? "store" : "stores"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="card-porcelain mt-6 px-6 py-20 text-center">
            <PackageSearch className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Nothing matches yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {data.items.length === 0
                ? "No merchant has published products yet. Be the first to open a store and put your catalogue in front of the marketplace."
                : "Try a different search term or category — or clear the filters to see the full catalog."}
            </p>
            {data.items.length === 0 ? (
              <Link
                to="/signup"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                Open a store
              </Link>
            ) : (
              <button
                onClick={() => {
                  setTerm("");
                  setCategory("All");
                }}
                className="mt-6 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{item.name}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <b className="shrink-0 font-display text-sm">
                      {formatMoney(item.basePrice, item.currency)}
                    </b>
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
                      className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                        added[item.id]
                          ? "bg-success text-white"
                          : "bg-primary text-primary-foreground hover:bg-navy-2"
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

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShoppingBag className="size-3.5" />
          Added items stay in each store's bag and follow you to secure checkout.
        </div>
      </section>
      <CTA />
    </Shell>
  );
}
