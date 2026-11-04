import { ShoppingBag } from "lucide-react";
import { brand } from "@/lib/brand";

/**
 * NDH Open Gateway master symbol, commerce edition.
 *
 * Uses the exact Najeeb Digital Hub Open Gateway mark (the folded
 * violet/electric ribbons around the white gate) from the parent brand,
 * with the commerce sector chip (ShoppingBag) docked in the lower-right
 * corner per the family identity convention.
 */
export function GatewayMark({
  size = 40,
  sector = true,
  className = "",
}: {
  size?: number;
  sector?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`gateway-symbol ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="gateway-tile"
        style={{ width: size, height: size, borderRadius: size * 0.28 }}
      >
        <img
          src="/ndh-gateway.png"
          alt=""
          width={size}
          height={size}
          className="block size-full object-cover"
          draggable={false}
        />
      </span>
      {sector ? (
        <span
          className="gateway-sector"
          style={{ borderRadius: size * 0.14, borderWidth: Math.max(1.5, size * 0.05) }}
        >
          <ShoppingBag strokeWidth={2.4} />
        </span>
      ) : null}
    </span>
  );
}

/**
 * The NDH ShopOS header lockup: NDH Gateway mark + two-line label.
 * Top line: NAJEEB DIGITAL HUB (small, tracking-widest, muted).
 * Bottom line: NDH ShopOS (bold, primary, Space Grotesk) with the
 *             "ShopOS" segment set apart so the product reads at a glance.
 */
export function EstStoreLockup({
  size = 40,
  onNavy = false,
  showFamily = true,
}: {
  size?: number;
  onNavy?: boolean;
  showFamily?: boolean;
}) {
  return (
    <span className={`flex min-w-0 items-center gap-2.5 ${onNavy ? "on-navy" : ""}`}>
      <GatewayMark size={size} />
      <span className="brand-lockup">
        {showFamily ? <span className="brand-eyebrow">{brand.family}</span> : null}
        <span className="brand-name">
          NDH <span className="brand-name-accent">ShopOS</span>
        </span>
      </span>
    </span>
  );
}
