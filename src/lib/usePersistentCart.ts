import { useEffect, useState } from "react";
import type { StoreProduct } from "./storefront";

export type CartLine = {
  product: StoreProduct;
  quantity: number;
  variantId: string | null;
  variantLabel: string | null;
  priceModifier: number;
};
type SavedLine = { productId: string; quantity: number; variantId: string | null };

export const CART_EVENT = "ndh-cart-changed";

/** Broadcast cart mutations so header badges elsewhere update live. */
function announceCart(vendorSlug: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { vendorSlug } }));
}

type StoredBag = { slug: string; count: number };

/** Sum item counts across every persisted vendor bag (ndh-cart:* keys). */
export function readAllBags(): { total: number; lastSlug: string | null; bags: StoredBag[] } {
  if (typeof window === "undefined") return { total: 0, lastSlug: null, bags: [] };
  const bags: StoredBag[] = [];
  let lastSlug: string | null = null;
  let lastTouch = "";
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith("ndh-cart:")) continue;
      const slug = key.slice("ndh-cart:".length);
      const lines = JSON.parse(window.localStorage.getItem(key) ?? "[]") as SavedLine[];
      const count = lines.reduce((sum, line) => sum + Math.max(0, line.quantity), 0);
      if (count > 0) bags.push({ slug, count });
      const touched = window.localStorage.getItem(`${key}:touched`) ?? "";
      if (count > 0 && touched >= lastTouch) {
        lastTouch = touched;
        lastSlug = slug;
      }
    }
  } catch {
    /* storage unavailable — header simply shows an empty bag */
  }
  return { total: bags.reduce((sum, bag) => sum + bag.count, 0), lastSlug, bags };
}

/**
 * Add a line straight into a vendor's persisted bag from outside the
 * storefront (catalog / home discovery). Returns false when the storage
 * write is impossible.
 */
export function addToVendorBag(vendorSlug: string, productId: string, variantId: string | null): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `ndh-cart:${vendorSlug}`;
    const lines = JSON.parse(window.localStorage.getItem(key) ?? "[]") as SavedLine[];
    const existing = lines.find((line) => line.productId === productId && line.variantId === variantId);
    if (existing) existing.quantity = Math.min(100, existing.quantity + 1);
    else lines.push({ productId, quantity: 1, variantId });
    window.localStorage.setItem(key, JSON.stringify(lines));
    window.localStorage.setItem(`${key}:touched`, new Date().toISOString());
    announceCart(vendorSlug);
    return true;
  } catch {
    return false;
  }
}

/** Live bag count for the commerce header. */
export function useCartBadge() {
  const [state, setState] = useState(() => readAllBags());
  useEffect(() => {
    const refresh = () => setState(readAllBags());
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}

export function usePersistentCart(vendorSlug: string, products: StoreProduct[]) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const key = `ndh-cart:${vendorSlug}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key) ?? "[]") as SavedLine[];
      setLines(
        saved.flatMap((savedLine) => {
          const product = products.find((item) => item.id === savedLine.productId);
          if (!product) return [];
          const variant = product.variants.find((item) => item.id === savedLine.variantId);
          return [
            {
              product,
              quantity: Math.max(1, Math.min(100, savedLine.quantity)),
              variantId: variant?.id ?? null,
              variantLabel: variant ? `${variant.variant_name}: ${variant.variant_value}` : null,
              priceModifier: variant?.price_modifier ?? 0,
            },
          ];
        }),
      );
    } catch {
      window.localStorage.removeItem(key);
    }
    setReady(true);
  }, [key, products]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(key, JSON.stringify(lines.map((line) => ({ productId: line.product.id, quantity: line.quantity, variantId: line.variantId }))));
    window.localStorage.setItem(`${key}:touched`, new Date().toISOString());
    announceCart(vendorSlug);
  }, [key, lines, ready, vendorSlug]);

  const add = (product: StoreProduct, variantId: string | null) =>
    setLines((current) => {
      const variant = product.variants.find((item) => item.id === variantId);
      const existing = current.findIndex((line) => line.product.id === product.id && line.variantId === variantId);
      if (existing >= 0)
        return current.map((line, index) =>
          index === existing ? { ...line, quantity: Math.min(100, line.quantity + 1) } : line,
        );
      return [
        ...current,
        {
          product,
          quantity: 1,
          variantId: variant?.id ?? null,
          variantLabel: variant ? `${variant.variant_name}: ${variant.variant_value}` : null,
          priceModifier: variant?.price_modifier ?? 0,
        },
      ];
    });

  const updateQuantity = (index: number, quantity: number) =>
    setLines((current) =>
      quantity < 1
        ? current.filter((_, lineIndex) => lineIndex !== index)
        : current.map((line, lineIndex) => (lineIndex === index ? { ...line, quantity: Math.min(100, quantity) } : line)),
    );

  const clear = () => setLines([]);

  return { lines, add, updateQuantity, clear, ready };
}
