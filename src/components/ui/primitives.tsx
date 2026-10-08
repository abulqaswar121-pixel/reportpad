import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({ className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-navy-2 hover:shadow-lg disabled:opacity-50 ${className}`}
      {...p}
    />
  );
}

export function Card({ className = "", ...p }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card-porcelain ${className}`} {...p} />;
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 font-display text-[11px] font-semibold tracking-wide text-secondary-foreground ${className}`}
    >
      {children}
    </span>
  );
}

export function Input(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`field ${p.className ?? ""}`} />;
}

/* ------------------------------------------------------------------ */
/* Semantic status badges for dense workspaces                         */
/* ------------------------------------------------------------------ */

export function statusBadgeClass(status: string): string {
  const key = status.toLowerCase();
  if (["paid", "success", "active", "delivered"].includes(key)) return "status-paid";
  if (["fulfilled", "completed"].includes(key)) return "status-success";
  if (["pending", "awaiting_payment", "past_due"].includes(key)) return "status-pending";
  if (["processing", "shipped", "in_transit", "trial"].includes(key)) return "status-shipped";
  if (["cancelled", "refunded", "expired", "failed"].includes(key)) return "status-danger";
  return "status-neutral";
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`status-badge ${statusBadgeClass(status)}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
