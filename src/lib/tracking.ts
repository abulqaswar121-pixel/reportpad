import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdminClient } from "./supabase/server";

export type TrackedOrder = {
  orderNumber: number;
  storeName: string;
  storeSlug: string;
  status: string;
  currency: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: Array<{ name: string; variant: string | null; quantity: number; unitPrice: number }>;
  history: Array<{ status: string; note: string | null; createdAt: string }>;
};

const configured = () =>
  Boolean(process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const lookupOrder = createServerFn({ method: "POST" })
  .validator((value: { orderNumber: string; email: string }) => value)
  .handler(async ({ data }) => {
    if (!configured())
      return {
        ok: false as const,
        error:
          "Order tracking becomes available once this deployment is connected to its Supabase backend.",
        order: null,
      };
    const orderNumber = Number.parseInt(data.orderNumber.replace(/\D/g, ""), 10);
    const email = data.email.trim().toLowerCase();
    if (!orderNumber || !/^\S+@\S+\.\S+$/.test(email))
      return {
        ok: false as const,
        error: "Enter the order number and the email address used at checkout.",
        order: null,
      };
    const admin = getSupabaseAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .select(
        "id,order_number,status,currency,subtotal,shipping_fee,total,created_at,vendor_id",
      )
      .eq("order_number", orderNumber)
      .ilike("customer_email", email)
      .maybeSingle();
    if (error || !order)
      return {
        ok: false as const,
        error: "We could not find an order matching that number and email.",
        order: null,
      };
    const { data: vendor } = await admin
      .from("vendors")
      .select("business_name,shop_slug")
      .eq("id", order.vendor_id)
      .maybeSingle();
    const { data: items } = await admin
      .from("order_items")
      .select("quantity,unit_price,products(name),product_variants(variant_name,variant_value)")
      .eq("order_id", order.id);
    const { data: history } = await admin
      .from("order_status_history")
      .select("to_status,note,created_at")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });
    const tracked: TrackedOrder = {
      orderNumber: Number(order.order_number),
      storeName: vendor?.business_name ?? "NDH eStore merchant",
      storeSlug: vendor?.shop_slug ?? "",
      status: order.status,
      currency: order.currency,
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shipping_fee),
      total: Number(order.total),
      createdAt: order.created_at,
      items: (items ?? []).map((line) => {
        const product = (line as unknown as { products: { name: string } | null }).products;
        const variant = (
          line as unknown as {
            product_variants: { variant_name: string; variant_value: string } | null;
          }
        ).product_variants;
        return {
          name: product?.name ?? "Item",
          variant: variant ? `${variant.variant_name}: ${variant.variant_value}` : null,
          quantity: line.quantity,
          unitPrice: Number(line.unit_price),
        };
      }),
      history: (history ?? []).map((entry) => ({
        status: entry.to_status,
        note: entry.note,
        createdAt: entry.created_at,
      })),
    };
    return { ok: true as const, error: null, order: tracked };
  });
