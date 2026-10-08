import { ShoppingBag } from "lucide-react";

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
 * The NDH eStore header lockup: master mark + two-line label.
 * Top line: NAJEEB DIGITAL HUB (small, tracking-widest, muted).
 * Bottom line: NDH eStore (bold, primary, Space Grotesk).
 */
export function EstStoreLockup({
  size = 40,
  onNavy = false,
}: {
  size?: number;
  onNavy?: boolean;
}) {
  return (
    <span className={`flex items-center gap-3 ${onNavy ? "on-navy" : ""}`}>
      <GatewayMark size={size} />
      <span className="brand-lockup">
        <span className="brand-eyebrow">NAJEEB DIGITAL HUB</span>
        <span className="brand-name">NDH eStore</span>
      </span>
    </span>
  );
}
