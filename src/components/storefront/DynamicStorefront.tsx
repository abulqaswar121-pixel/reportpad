import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { storefrontQuery, type StoreProduct } from "@/lib/storefront";
import { usePersistentCart } from "@/lib/usePersistentCart";
import { createOrder, type OrderSummary } from "@/lib/orders";
import { initializeOrderPayment } from "@/lib/payments";
import { Badge, Button } from "@/components/ui/primitives";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { MetaPixel, trackBrowserCommerce } from "./MetaPixel";

export function DynamicStorefront({
  vendorSlug,
  initialProductSlug,
}: {
  vendorSlug: string;
  initialProductSlug?: string;
}) {
  const { data } = useSuspenseQuery(storefrontQuery(vendorSlug));
  const vendor = data.vendor;
  const products = data.products;
  const initialProduct = products.find((product) => product.slug === initialProductSlug);
  const {
    lines: cart,
    add: addToCart,
    updateQuantity,
    clear: clearCart,
  } = usePersistentCart(vendorSlug, products);
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState<StoreProduct | undefined>(initialProduct);
  const [variant, setVariant] = useState(0);
  const [country, setCountry] = useState("Nigeria");
  const [deliveryState, setDeliveryState] = useState(data.shippingZones[0]?.state ?? "");
  const [zone, setZone] = useState(data.shippingZones[0]?.zone_name ?? "");
  const [sidebar, setSidebar] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "", note: "" });
  const [checkoutError, setCheckoutError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [checkoutToken, setCheckoutToken] = useState(() => crypto.randomUUID());

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("bag") === "1") setDrawer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.notFound || !vendor)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-5">
        <div className="card-porcelain max-w-lg p-9 text-center">
          <h1 className="text-3xl font-semibold">Store not found</h1>
          <p className="mt-3 text-muted-foreground">
            This address may have changed, or the store is not currently published.
          </p>
        </div>
      </main>
    );

  if (data.locked)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-5">
        <div className="card-porcelain max-w-xl p-9 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface font-display text-xl font-semibold">
            {vendor.design_settings.logo_text}
          </div>
          <h1 className="mt-6 text-3xl font-semibold">{vendor.business_name} is refreshing its store</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Online ordering is temporarily unavailable. You can still contact the business directly for assistance.
          </p>
          <a
            href={`https://wa.me/${vendor.whatsapp_number}?text=${encodeURIComponent(`Hello ${vendor.business_name}, I would like to make an enquiry.`)}`}
            className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground"
          >
            Chat on WhatsApp
          </a>
        </div>
      </main>
    );

  const selectedVariants = selected?.variants ?? [];
  const intl = country !== "Nigeria";
  const countryCode =
    country === "Nigeria" ? "NG" : country === "United Kingdom" ? "GB" : country === "United States" ? "US" : "CA";
  const rate = 1600;
  const allDigital =
    cart.length > 0 &&
    cart.every((item) => item.product.product_type === "digital" || item.product.product_type === "booking");
  const availableStates = [
    ...new Set(data.shippingZones.filter((item) => item.country_code === "NG").map((item) => item.state)),
  ];
  const chosenZone = data.shippingZones.find((item) => item.state === deliveryState && item.zone_name === zone);
  const standardShipping = intl ? 35 * rate : (chosenZone?.fee ?? 0);
  const cargoProfile = data.cargoProfiles.find((profile) => profile.destination_country === countryCode);
  const cargoShipping =
    vendor.business_category === "cargo_logistics" && cargoProfile
      ? Math.max(
          cargoProfile.minimum_charge,
          cart.reduce((sum, item) => sum + item.product.weight_kg * item.quantity, 0) * cargoProfile.rate,
        )
      : standardShipping;
  const shipping = allDigital ? 0 : cargoShipping;
  const subtotal = cart.reduce((sum, item) => sum + (item.product.base_price + item.priceModifier) * item.quantity, 0);
  const total = subtotal + shipping;
  const money = (amount: number) => (intl ? `$${(amount / rate).toFixed(2)}` : `₦${amount.toLocaleString()}`);

  const add = (product: StoreProduct, variantId: string | null) => {
    addToCart(product, variantId);
    trackBrowserCommerce("AddToCart", vendorSlug, vendor.default_currency, product.base_price, [product.id]);
    setDrawer(true);
  };

  const placeOrder = async (
    provider: "paystack" | "flutterwave" | "stripe" | "bank_transfer" | "whatsapp",
  ) => {
    setCheckoutError("");
    if (customer.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(customer.email)) {
      setCheckoutError("Enter your full name and a valid email address.");
      return;
    }
    if (!allDigital && customer.address.trim().length < 8) {
      setCheckoutError("Enter a complete delivery address.");
      return;
    }
    if (!allDigital && countryCode === "NG" && !chosenZone) {
      setCheckoutError("Choose an available delivery zone.");
      return;
    }
    trackBrowserCommerce(
      "InitiateCheckout",
      vendorSlug,
      vendor.default_currency,
      total,
      cart.map((item) => item.product.id),
    );
    setSubmitting(true);
    const result = await createOrder({
      data: {
        vendorSlug,
        checkoutToken,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          note: customer.note,
        },
        destination: {
          country_code: countryCode,
          state: chosenZone?.state,
          zone: chosenZone?.zone_name,
          address: customer.address,
        },
        zoneId: countryCode === "NG" ? (chosenZone?.id ?? null) : null,
        provider,
        items: cart.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      },
    });
    if (!result.ok || !result.order) {
      setSubmitting(false);
      setCheckoutError(result.error ?? "Unable to create order.");
      return;
    }
    if (provider === "paystack" || provider === "flutterwave") {
      const payment = await initializeOrderPayment({
        data: { orderId: result.order.order_id, checkoutToken, provider },
      });
      if (!payment.ok || !payment.authorizationUrl) {
        setSubmitting(false);
        setCheckoutError(payment.error ?? "Unable to open secure payment.");
        return;
      }
      clearCart();
      setCheckoutToken(crypto.randomUUID());
      window.location.assign(payment.authorizationUrl);
      return;
    }
    setSubmitting(false);
    setOrder(result.order);
    if (provider === "whatsapp") {
      const text = `Hello ${vendor.business_name}, my order NDH-${result.order.order_number} contains: ${cart
        .map(
          (item) =>
            `${item.quantity}× ${item.product.name}${item.variantLabel ? ` (${item.variantLabel})` : ""}`,
        )
        .join(", ")}. Delivery: ${zone || "Not required"}. Total: ${money(total)}.`;
      window.open(`https://wa.me/${vendor.whatsapp_number}?text=${encodeURIComponent(text)}`);
    }
    clearCart();
    setCheckoutToken(crypto.randomUUID());
  };
  const whatsapp = () => void placeOrder("whatsapp");

  const bookingBusiness = ["travel_tours", "freelance_services", "event_ticketing"].includes(
    vendor.business_category,
  );
  const categories = [...new Set(products.map((product) => product.category))];
  const navLinks = vendor.design_settings.enabled_pages.length
    ? vendor.design_settings.enabled_pages
    : ["Shop", "About", "Contact"];
  const heroImage =
    products.find((product) => product.is_featured)?.image_url || products[0]?.image_url || "/hero-fashion-real.jpg";
  const heroCopy =
    vendor.business_category === "cargo_logistics"
      ? ["GLOBAL LOGISTICS", "Move anything. Anywhere.", "Reliable cargo routes with transparent weight and volume pricing."]
      : bookingBusiness
        ? ["BOOK YOUR EXPERIENCE", "Time well spent, beautifully planned.", "Explore available services, dates and experiences created for you."]
        : vendor.business_category === "grocery_food"
          ? ["FRESH THIS WEEK", "Better food, closer to home.", "Shop fresh essentials from a business you know and trust."]
          : ["THE SIGNATURE EDIT", "Designed for the way you live.", "Discover considered products selected with quality and confidence."];
  const logo = (
    <>
      {vendor.design_settings.logo_url ? (
        <img src={vendor.design_settings.logo_url} alt={vendor.business_name} className="size-full object-cover" />
      ) : (
        vendor.design_settings.logo_text
      )}
    </>
  );
  const headerClass =
    vendor.design_settings.nav_style === "floating_island"
      ? "sticky top-3 z-30 mx-auto mt-3 w-[calc(100%-24px)] max-w-6xl rounded-full border border-border bg-card/90 shadow-lg backdrop-blur-xl"
      : vendor.design_settings.nav_style === "centered"
        ? "relative z-30 mx-auto mt-2 max-w-7xl border-b border-border bg-card"
        : "relative z-30 w-full border-b border-border bg-card";

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={
        {
          "--store-accent": vendor.design_settings.primary_accent,
          "--store-background": vendor.design_settings.background_accent,
          backgroundColor: "var(--store-background)",
        } as React.CSSProperties
      }
    >
      <MetaPixel
        pixelId={vendor.meta_pixel_id}
        vendorSlug={vendorSlug}
        productId={selected?.id}
        currency={vendor.default_currency}
        value={selected?.base_price}
      />
      <div className="overflow-hidden whitespace-nowrap bg-[var(--store-accent)] py-2 text-center text-xs font-semibold text-white">
        <span className="inline-block">{vendor.design_settings.announcement_text}</span>
      </div>
      <header className={`flex items-center justify-between px-5 py-3 ${headerClass}`}>
        <button
          onClick={() => setSidebar(true)}
          aria-label="Open store menu"
          className={vendor.design_settings.nav_style === "sidebar" ? "block" : "md:hidden"}
        >
          <Menu className="size-5" />
        </button>
        <button onClick={() => setSelected(undefined)} className="flex min-w-0 items-center gap-3">
          <span
            className={`grid size-10 shrink-0 place-items-center overflow-hidden bg-[var(--store-accent)] font-display text-sm font-semibold text-white ${
              vendor.design_settings.logo_shape === "circle" ? "rounded-full" : "rounded-xl"
            }`}
          >
            {logo}
          </span>
          <b className="hidden truncate font-display sm:block">{vendor.business_name.toUpperCase()}</b>
        </button>
        <nav className={`${vendor.design_settings.nav_style === "sidebar" ? "hidden" : "hidden gap-6 text-sm font-semibold md:flex"}`}>
          {navLinks.map((link) => (
            <button key={link} className="text-ink-soft hover:text-foreground">
              {link}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            aria-label="Search the collection"
            onClick={() => {
              setSelected(undefined);
              document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search className="size-5" />
          </button>
          <button onClick={() => setDrawer(true)} className="relative" aria-label="Open your bag">
            <ShoppingBag className="size-5" />
            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-[var(--store-accent)] font-display text-[10px] font-semibold text-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {sidebar && (
        <div className="fixed inset-0 z-50 bg-white p-6">
          <button onClick={() => setSidebar(false)} aria-label="Close store menu" className="float-right grid size-10 place-items-center rounded-full bg-muted">
            <X className="size-5" />
          </button>
          <b className="font-display text-xl">{vendor.business_name.toUpperCase()}</b>
          <nav className="mt-16 space-y-7 text-3xl font-semibold">
            {navLinks.map((link) => (
              <button key={link} className="block">
                {link}
              </button>
            ))}
          </nav>
        </div>
      )}

      {selected ? (
        <section className="mx-auto max-w-7xl px-5 py-12">
          <button onClick={() => setSelected(undefined)} className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-foreground">
            <ChevronLeft className="size-4" />
            Back to collection
          </button>
          <div className="mt-7 grid gap-10 lg:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {(selected.image_urls.length ? selected.image_urls : [{ url: selected.image_url, path: "" }]).map(
                (image, index) => (
                  <img
                    key={`${image.url}-${index}`}
                    src={image.url}
                    alt={`${selected.name} view ${index + 1}`}
                    className={`w-full rounded-2xl border border-border object-cover ${
                      index === 0 ? "h-[480px] sm:col-span-2 sm:h-[560px]" : "h-64"
                    }`}
                  />
                ),
              )}
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Badge>{selected.category}</Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">{selected.name}</h1>
              <p className="mt-4 font-display text-2xl font-semibold">
                {money(selected.base_price + (selectedVariants[variant]?.price_modifier || 0))}
              </p>
              <p className="mt-6 max-w-lg leading-7 text-muted-foreground">{selected.description}</p>
              {selectedVariants.length > 0 && (
                <div className="mt-7">
                  <b className="field-label">Choose option</b>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedVariants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setVariant(i)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                          variant === i
                            ? "border-transparent bg-[var(--store-accent)] text-white"
                            : "border-border bg-card hover:border-border-strong"
                        }`}
                      >
                        {v.variant_value}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button
                onClick={() => add(selected, selectedVariants[variant]?.id ?? null)}
                className="mt-8 w-full rounded-full bg-[var(--store-accent)] py-4"
              >
                {selected.product_type === "booking" || selected.product_type === "service"
                  ? "Reserve now"
                  : selected.product_type === "digital"
                    ? "Buy digital product"
                    : "Add to bag"}
              </Button>
              <div className="mt-7 divide-y divide-border border-y border-border text-sm text-ink-soft">
                {["Secure checkout with Paystack or Flutterwave", "Transparent regional delivery fees", "Authenticity guaranteed by the store"].map(
                  (x) => (
                    <div key={x} className="flex items-center gap-2 py-4">
                      <Check className="size-4 text-cyan" /> {x}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-5 pb-14 pt-10">
            <div className="relative overflow-hidden rounded-[2rem] bg-[var(--store-accent)] text-white">
              <img className="absolute inset-0 h-full w-full object-cover opacity-40" src={heroImage} alt="" />
              <div className="relative max-w-2xl px-7 py-20 sm:px-14 sm:py-28">
                <p className="font-display text-xs font-semibold tracking-[0.25em]">{heroCopy[0]}</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.02em] sm:text-6xl">
                  {heroCopy[1]}
                </h1>
                <p className="mt-5 max-w-md leading-7 text-white/80">{heroCopy[2]}</p>
                <button
                  onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 rounded-full bg-white px-6 py-3 font-bold text-foreground"
                >
                  Explore collection
                </button>
              </div>
            </div>
          </section>

          {bookingBusiness && (
            <section className="mx-auto max-w-7xl px-5 pb-10">
              <div className="card-porcelain grid gap-5 p-6 lg:grid-cols-[.7fr_1.3fr]">
                <div>
                  <Badge>LIVE AVAILABILITY</Badge>
                  <h2 className="mt-4 text-2xl font-semibold">Choose your date</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Select an experience below to see its published schedule and remaining capacity.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {products
                    .flatMap((product) => product.booking_slots.map((slot) => ({ product, slot })))
                    .slice(0, 6)
                    .map(({ product, slot }) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelected(product)}
                        className="rounded-xl border border-border bg-card p-4 text-left hover:border-border-strong"
                      >
                        <b className="block text-sm">{product.name}</b>
                        <span className="mt-2 block text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: vendor.timezone,
                          }).format(new Date(slot.starts_at))}
                        </span>
                        <span className="mt-2 block text-xs font-bold">
                          {slot.capacity - slot.reserved_count} places available
                        </span>
                      </button>
                    ))}
                  {!products.some((product) => product.booking_slots.length) && (
                    <div className="rounded-xl bg-surface p-5 text-sm text-muted-foreground sm:col-span-2">
                      New availability is being prepared. Contact the business through WhatsApp for the next open date.
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {vendor.business_category === "cargo_logistics" && data.cargoProfiles.length > 0 && (
            <section className="mx-auto max-w-7xl px-5 pb-10">
              <div className="anchor-navy rounded-[1.5rem] p-6 sm:p-8">
                <p className="eyebrow">Freight rate profiles</p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {data.cargoProfiles.map((profile) => (
                    <div key={profile.id} className="rounded-xl border border-white/15 bg-white/5 p-4">
                      <b className="text-white">{profile.name}</b>
                      <p className="mt-2 font-display text-2xl font-semibold text-white">
                        {profile.currency} {profile.rate.toLocaleString()}{" "}
                        <small className="text-xs font-normal opacity-60">/ {profile.metric.toUpperCase()}</small>
                      </p>
                      <p className="mt-2 text-xs opacity-60">
                        {profile.origin_country} → {profile.destination_country} · {profile.transport_mode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section id="collection" className="mx-auto max-w-7xl px-5 py-8">
            <div className="scroll-x flex gap-2 pb-2">
              {["All pieces", ...categories].map((categoryName, index) => (
                <span key={categoryName} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-[var(--store-accent)] text-white" : "border border-border bg-card text-ink-soft"}`}>
                  {categoryName}
                </span>
              ))}
            </div>
            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="eyebrow">Curated for you</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">The collection</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </span>
            </div>
            {products.length === 0 ? (
              <div className="card-porcelain mt-7 px-6 py-20 text-center">
                <ShoppingBag className="mx-auto size-8 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">The shelves are being stocked</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  This store has not published products yet. Check back soon, or message the business on WhatsApp.
                </p>
              </div>
            ) : (
              <div className="mt-7 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <article key={p.id} className="card-porcelain card-porcelain-lift overflow-hidden">
                    <button onClick={() => setSelected(p)} className="group block w-full overflow-hidden bg-surface">
                      <img
                        src={p.image_url || "/hero-fashion-real.jpg"}
                        alt={p.name}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </button>
                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{p.name}</h3>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{p.category}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <b className="font-display text-sm">{money(p.base_price)}</b>
                        <button
                          onClick={() => add(p, null)}
                          aria-label={`Add ${p.name} to bag`}
                          className="grid size-8 place-items-center rounded-full bg-[var(--store-accent)] text-white"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <footer className="mt-20 bg-[var(--store-accent)] px-5 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold">{vendor.business_name}</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">{vendor.business_description}</p>
          </div>
          <div>
            <b className="font-display text-xs tracking-[0.18em]">VISIT</b>
            <p className="mt-4 text-sm text-white/60">Shop · Our story · Delivery · Care guide</p>
          </div>
          <div>
            <b className="font-display text-xs tracking-[0.18em]">POWERED BY</b>
            <p className="mt-4 text-sm leading-6 text-white/60">
              This store runs on NDH eStore — commerce infrastructure by Najeeb Digital Hub.
            </p>
          </div>
        </div>
      </footer>

      <button
        onClick={() =>
          window.open(
            `https://wa.me/${vendor.whatsapp_number}?text=${encodeURIComponent("Hello! I have a question about an item on your store.")}`,
          )
        }
        aria-label="Chat with the store on WhatsApp"
        className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-[#128c5a] text-white shadow-xl hover:brightness-110"
      >
        <MessageCircle className="size-6" />
      </button>

      {drawer && (
        <>
          <button className="fixed inset-0 z-40 bg-foreground/45 backdrop-blur-[2px]" onClick={() => setDrawer(false)} aria-label="Close bag" />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-2xl font-semibold">Your bag</h2>
              <button onClick={() => setDrawer(false)} aria-label="Close bag" className="grid size-10 place-items-center rounded-full bg-muted">
                <X className="size-4" />
              </button>
            </div>
            <div className="scroll-slim flex-1 overflow-auto px-6">
              {cart.length === 0 ? (
                order ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-xl text-success">
                      ✓
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">Order NDH-{order.order_number} received</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      We saved your order securely. Keep this number for your records.
                    </p>
                    <button
                      onClick={() => setOrder(null)}
                      className="mt-5 rounded-full bg-surface px-5 py-2.5 text-sm font-bold"
                    >
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <div className="py-20 text-center text-muted-foreground">
                    <ShoppingBag className="mx-auto mb-3 size-8" />
                    Your bag is empty.
                  </div>
                )
              ) : (
                cart.map((x, i) => (
                  <div key={`${x.product.id}-${x.variantId ?? "base"}`} className="flex gap-4 border-b border-border py-5">
                    <img className="size-20 rounded-xl border border-border object-cover" src={x.product.image_url} alt={x.product.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <b className="truncate text-sm">{x.product.name}</b>
                        <b className="shrink-0 font-display text-sm">
                          {money((x.product.base_price + x.priceModifier) * x.quantity)}
                        </b>
                      </div>
                      {x.variantLabel && <p className="mt-0.5 text-xs text-muted-foreground">{x.variantLabel}</p>}
                      <p className="mt-0.5 text-xs text-muted-foreground">{money(x.product.base_price + x.priceModifier)} each</p>
                      <div className="stepper mt-3">
                        <button onClick={() => updateQuantity(i, x.quantity - 1)} aria-label="Decrease quantity" disabled={x.quantity <= 1}>
                          <Minus className="size-3" />
                        </button>
                        <output>{x.quantity}</output>
                        <button onClick={() => updateQuantity(i, x.quantity + 1)} aria-label="Increase quantity">
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border bg-background px-6 py-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label">Full name</span>
                    <input
                      value={customer.name}
                      onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
                      className="field mt-1.5"
                      placeholder="Adaeze Okafor"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Email</span>
                    <input
                      value={customer.email}
                      onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
                      type="email"
                      className="field mt-1.5"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="field-label">Phone / WhatsApp</span>
                    <input
                      value={customer.phone}
                      onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))}
                      className="field mt-1.5"
                      placeholder="0803 000 0000"
                    />
                  </label>
                </div>
                {!allDigital && (
                  <label className="mt-3 block">
                    <span className="field-label">Delivery address</span>
                    <textarea
                      value={customer.address}
                      onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))}
                      className="field mt-1.5 h-20 resize-none"
                      placeholder="Street, area, city"
                    />
                  </label>
                )}
                <label className="mt-4 block">
                  <span className="field-label">Delivery country</span>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="field mt-1.5">
                    <option>Nigeria</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>Canada</option>
                  </select>
                </label>
                {!allDigital && !intl && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="field-label">State</span>
                      <select
                        value={deliveryState}
                        onChange={(event) => {
                          const nextState = event.target.value;
                          setDeliveryState(nextState);
                          setZone(data.shippingZones.find((item) => item.state === nextState)?.zone_name ?? "");
                        }}
                        className="field mt-1.5"
                      >
                        {availableStates.map((state) => (
                          <option key={state}>{state}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="field-label">Regional zone</span>
                      <select value={zone} onChange={(event) => setZone(event.target.value)} className="field mt-1.5">
                        {data.shippingZones
                          .filter((item) => item.state === deliveryState)
                          .map((item) => (
                            <option key={item.id} value={item.zone_name}>
                              {item.zone_name} — ₦{item.fee.toLocaleString()}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                )}
                {!allDigital && (
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs text-muted-foreground">
                    <Truck className="size-3.5 shrink-0 text-cyan" />
                    {allDigital
                      ? "Digital order — no delivery fee."
                      : intl
                        ? `International shipping is calculated at a flat ${money(35 * rate)} card rate.`
                        : chosenZone
                          ? `${chosenZone.zone_name}: ₦${chosenZone.fee.toLocaleString()}${
                              chosenZone.estimated_days_min != null && chosenZone.estimated_days_max != null
                                ? ` · usually ${chosenZone.estimated_days_min}–${chosenZone.estimated_days_max} days`
                                : ""
                            }`
                          : "Select a state and zone to price delivery."}
                  </p>
                )}

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{allDigital ? "Free" : money(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 font-display text-lg font-semibold">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                </div>

                {checkoutError && (
                  <p role="alert" className="mt-4 rounded-xl bg-destructive-soft px-3 py-2.5 text-xs font-semibold text-destructive">
                    {checkoutError}
                  </p>
                )}

                <Button
                  disabled={submitting}
                  onClick={() => void placeOrder(intl ? "flutterwave" : "paystack")}
                  className="mt-5 w-full rounded-full bg-[var(--store-accent)] py-3.5"
                >
                  {submitting
                    ? "Creating secure order…"
                    : intl
                      ? "Continue to Flutterwave card"
                      : "Continue to Paystack"}
                </Button>
                {!intl && (
                  <button
                    disabled={submitting}
                    onClick={whatsapp}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#128c5a] py-3 font-bold text-[#128c5a] hover:bg-[#128c5a]/10"
                  >
                    <MessageCircle className="size-4" /> Order via WhatsApp
                  </button>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Secure checkout · Your information stays private
                </p>
              </div>
            )}
          </aside>
        </>
      )}
    </main>
  );
}
