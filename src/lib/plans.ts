/**
 * Subscription plan catalogue for NDH ShopOS.
 *
 * Merchant-facing names are Free, Starter and Growth. They map onto the
 * database `SubscriptionTier` values (starter | pro | global_enterprise) so the
 * existing billing, limits and admin logic keep working unchanged.
 */
export type Plan = {
  /** Merchant-facing plan label. */
  name: string;
  /** Value stored in `vendors.subscription_tier`. */
  tier: "starter" | "pro" | "global_enterprise";
  monthly: string;
  annual: string;
  /** Transaction fee copy. */
  fee: string;
  desc: string;
  limits: string[];
  cta: string;
  /** Route the CTA should send a merchant to. */
  ctaTo: "/signup" | "/book-call";
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Free",
    tier: "starter",
    monthly: "₦0",
    annual: "₦0",
    fee: "3.5% transaction fee",
    desc: "Test the water and publish your first store link.",
    limits: [
      "Up to 10 products",
      "Your ndhshopos.com store link",
      "WhatsApp ordering",
      "Naira checkout",
    ],
    cta: "Create your store free",
    ctaTo: "/signup",
  },
  {
    name: "Starter",
    tier: "pro",
    monthly: "₦5,000",
    annual: "₦48,000",
    fee: "2.5% transaction fee",
    desc: "For merchants selling every week who need room to grow.",
    limits: [
      "Up to 100 products",
      "Digital downloads & bookings",
      "State-by-state delivery fees",
      "Inventory alerts & email support",
    ],
    cta: "Start Free Trial",
    ctaTo: "/signup",
    popular: true,
  },
  {
    name: "Growth",
    tier: "global_enterprise",
    monthly: "₦15,000",
    annual: "₦144,000",
    fee: "1.5% local · 3.5% international",
    desc: "For brands selling across borders with a team behind them.",
    limits: [
      "Unlimited products & staff access",
      "USD, GBP and NGN pricing",
      "Custom domain eligibility",
      "Cargo profiles & priority support",
    ],
    cta: "Talk to sales",
    ctaTo: "/book-call",
  },
];

/** Side-by-side limits shown on the /pricing comparison strip. */
export const planComparison = [
  ["Products", "Up to 10", "Up to 100", "Unlimited"],
  ["Transaction fee", "3.5%", "2.5%", "1.5% local · 3.5% intl."],
  ["Currencies", "NGN", "NGN", "NGN · USD · GBP"],
  ["Delivery zones", "1 per state", "Regional sub-zones", "Regional + cargo"],
  ["Digital downloads", "—", "Included", "Included"],
  ["Service bookings", "—", "Included", "Included"],
  ["Custom domain", "—", "—", "Eligible"],
  ["Support", "Email", "Standard", "Priority"],
] as const;
