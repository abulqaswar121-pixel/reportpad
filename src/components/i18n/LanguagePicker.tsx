import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import {
  applyLanguage,
  currentLanguage,
  languageOf,
  languages,
  syncDocumentLanguage,
  type LanguageCode,
} from "@/lib/i18n";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => unknown;
      };
    };
  }
}

let engineRequested = false;

/**
 * Loads the Google Translate engine in the background and attaches it to a
 * hidden mount point. All Google chrome is suppressed in `styles.css`, so the
 * visitor only ever sees the NDH language dropdown.
 */
function loadTranslateEngine() {
  if (typeof document === "undefined" || engineRequested) return;
  engineRequested = true;

  // Hidden host element the engine needs in order to initialise.
  if (!document.getElementById("google_translate_element")) {
    const host = document.createElement("div");
    host.id = "google_translate_element";
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none";
    document.body.appendChild(host);
  }

  window.googleTranslateElementInit = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    if (!TranslateElement) return;
    new TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: languages.map((language) => language.code).join(","),
        autoDisplay: false,
        layout: 0,
      },
      "google_translate_element",
    );
  };

  if (!document.getElementById("ndh-google-translate-script")) {
    const script = document.createElement("script");
    script.id = "ndh-google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.referrerPolicy = "no-referrer";
    document.body.appendChild(script);
  }
}

/** Branded language picker — the only translation UI on the site. */
export function LanguagePicker({
  variant = "header",
  className = "",
}: {
  variant?: "header" | "drawer";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<LanguageCode>("en");
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    syncDocumentLanguage();
    setActive(currentLanguage());
    loadTranslateEngine();

    const onClickAway = (event: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (code: LanguageCode) => {
    setOpen(false);
    setActive(code);
    applyLanguage(code);
  };

  const current = languageOf(active);
  const isDrawer = variant === "drawer";

  return (
    <span ref={wrap} className={`relative ${className || "inline-flex"}`}>
      <Button
        variant="outline"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.label}. Change language`}
        className={
          isDrawer
            ? "flex w-full items-center justify-between gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-ink-soft"
            : "flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-ink-soft hover:border-border-strong hover:text-foreground"
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <Globe className="size-4 shrink-0" />
          <span className="truncate">{isDrawer ? `Language · ${current.label}` : current.label}</span>
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-[10px] leading-none transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </Button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose language"
          className={`z-[60] mt-2 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-2xl ${
            isDrawer ? "absolute bottom-full left-0 w-full" : "absolute right-0 top-full w-56"
          }`}
        >
          {languages.map((language) => {
            const selected = language.code === active;
            return (
              <li key={language.code}>
                <Button
                  variant="ghost"
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(language.code)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                    selected ? "bg-primary text-primary-foreground" : "text-ink-soft hover:bg-surface"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{language.label}</span>
                    <span className={`block truncate text-[11px] ${selected ? "text-white/60" : "text-muted-foreground"}`}>
                      {language.native}
                    </span>
                  </span>
                  {selected && <Check className="size-4 shrink-0" />}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
}
