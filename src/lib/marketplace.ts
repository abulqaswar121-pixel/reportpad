import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { getSupabaseServerClient } from "./supabase/server";
import { demoVendor, products as demoProducts } from "./data";

export type CatalogItem = {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  slug: string;
  name: string;
  category: string;
  basePrice: number;
  currency: string;
  imageUrl: string | null;
  productType: "physical" | "booking" | "service" | "digital";
  featured: boolean;
};

export type MarketplaceData = {
  configured: boolean;
  stores: number;
  items: CatalogItem[];
  categories: string[];
};

const configured = () =>
  Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);

function demoMarketplace(): MarketplaceData {
  const items: CatalogItem[] = demoProducts.map((product) => ({
    id: product.id,
    vendorId: demoVendor.id,
    vendorName: demoVendor.business_name,
    vendorSlug: demoVendor.shop_slug,
    slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: product.name,
    category: product.category,
    basePrice: product.base_price,
    currency: "NGN",
    imageUrl: product.image_url,
    productType: product.product_type,
    featured: product.is_featured,
  }));
  return {
    configured: false,
    stores: 1,
    items,
    categories: [...new Set(items.map((item) => item.category))],
  };
}

export const getMarketplace = createServerFn({ method: "GET" }).handler(
  async (): Promise<MarketplaceData> => {
    if (!configured()) return demoMarketplace();
    const client = getSupabaseServerClient();
    const [vendorResult, productResult] = await Promise.all([
      client
        .from("vendors")
        .select("id,business_name,shop_slug,default_currency")
        .eq("published", true)
        .order("business_name"),
      client
        .from("products")
        .select(
          "id,vendor_id,name,slug,base_price,image_url,category,is_featured,product_type",
        )
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(240),
    ]);
    if (vendorResult.error || productResult.error)
      throw new Error("Unable to load the marketplace right now.");
    const vendors = new Map(
      (vendorResult.data ?? []).map((vendor) => [
        vendor.id,
        {
          name: vendor.business_name,
          slug: vendor.shop_slug,
          currency: vendor.default_currency || "NGN",
        },
      ]),
    );
    const items: CatalogItem[] = (productResult.data ?? [])
      .filter((row) => vendors.has(row.vendor_id))
      .map((row) => {
        const vendor = vendors.get(row.vendor_id)!;
        return {
          id: row.id,
          vendorId: row.vendor_id,
          vendorName: vendor.name,
          vendorSlug: vendor.slug,
          slug: row.slug,
          name: row.name,
          category: row.category,
          basePrice: Number(row.base_price),
          currency: vendor.currency,
          imageUrl: row.image_url,
          productType: row.product_type,
          featured: row.is_featured,
        };
      });
    return {
      configured: true,
      stores: vendors.size,
      items,
      categories: [...new Set(items.map((item) => item.category))].sort(),
    };
  },
);

export const marketplaceQuery = () =>
  queryOptions({
    queryKey: ["marketplace"],
    queryFn: () => getMarketplace(),
    staleTime: 30_000,
  });

export function formatMoney(amount: number, currency: string) {
  if (currency === "NGN") return `₦${amount.toLocaleString()}`;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
