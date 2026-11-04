/**
 * Single source of truth for NDH ShopOS identity.
 * NDH ShopOS is a Shopify-style store-builder SaaS and a member of the
 * NAJEEB DIGITAL HUB (NDH) family.
 */
export const brand = {
  name: "NDH ShopOS",
  family: "NAJEEB DIGITAL HUB",
  shortFamily: "NDH",
  tagline:
    "The all-in-one store builder and commerce operating system for modern African merchants and creators.",
  seoTitle: "NDH ShopOS — Build Your Own Online Store in Minutes",
  seoDescription:
    "Create a branded online store in minutes with NDH ShopOS: custom store link, instant WhatsApp ordering, multi-currency card payments, Nigeria-wide shipping rates and fast bank payouts. No coding required.",
  /** Public storefront host used in copy and the dashboard share link. */
  storeHost: "ndhshopos.com",
  parent: {
    label: "Najeeb Digital Hub",
    legalNote: "A Product of Najeeb Digital Hub",
    url: "https://ndhnet.com",
  },
  support: {
    email: "admin@ndh.com.ng",
    phone: "0902 993 2794",
    phoneHref: "+2349029932794",
    whatsapp: "2349029932794",
  },
} as const;

/** `ndhshopos.com/store/yourbrand` — the public address of a merchant store. */
export function storeUrl(slug: string) {
  return `${brand.storeHost}/store/${slug}`;
}
