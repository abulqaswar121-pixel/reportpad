/**
 * Multi-language support for NDH ShopOS.
 *
 * The platform ships English by default and offers five additional commercial
 * languages. Translation is performed by Google Translate running invisibly in
 * the background — the visitor only ever sees our own NDH dropdown, never a
 * Google widget, banner or logo.
 */
export type LanguageCode = "en" | "ha" | "yo" | "ig" | "fr" | "ar";

export type Language = {
  code: LanguageCode;
  label: string;
  /** Endonym, shown next to the English label. */
  native: string;
  dir?: "rtl";
};

export const languages: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ha", label: "Hausa", native: "Hausa" },
  { code: "yo", label: "Yoruba", native: "Yorùbá" },
  { code: "ig", label: "Igbo", native: "Igbo" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

/** Languages offered to the invisible Google Translate engine. */
export const translateLanguages = languages.map((language) => language.code).join(",");

export const DEFAULT_LANGUAGE: LanguageCode = "en";

const COOKIE_NAME = "googtrans";

export function isLanguage(value: string | null | undefined): value is LanguageCode {
  return Boolean(value) && languages.some((language) => language.code === value);
}

export function languageOf(code: string): Language {
  return languages.find((language) => language.code === code) ?? languages[0];
}

/** Read the active language straight from the Google Translate cookie. */
export function currentLanguage(): LanguageCode {
  if (typeof document === "undefined") return DEFAULT_LANGUAGE;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  const value = match?.[1] ?? "";
  // Cookie shape is /<source>/<target>, e.g. /en/yo
  const target = value.split("/").filter(Boolean).pop();
  return isLanguage(target) ? target : DEFAULT_LANGUAGE;
}

function writeCookie(lang: LanguageCode) {
  const value = `/en/${lang}`;
  const expires = lang === DEFAULT_LANGUAGE ? "Thu, 01 Jan 1970 00:00:00 GMT" : "Fri, 31 Dec 9999 23:59:59 GMT";
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires}; samesite=lax${secure}`;
  // Also clear the host-only variant so switching back to English never sticks.
  if (lang === DEFAULT_LANGUAGE) {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${COOKIE_NAME}=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Apply a language: write the Google Translate cookie, keep the document
 * direction correct for Arabic, then let the engine re-translate.
 *
 * The engine only re-reads the cookie on load, so we reload the page behind a
 * short brand-coloured veil — no Google UI ever appears.
 */
export function applyLanguage(lang: LanguageCode) {
  if (typeof window === "undefined") return;
  writeCookie(lang);

  const root = document.documentElement;
  root.lang = lang;
  if (languageOf(lang).dir === "rtl") root.dir = "rtl";
  else root.removeAttribute("dir");

  // A quiet veil so the reload reads as an intentional transition.
  const veil = document.createElement("div");
  veil.setAttribute("aria-hidden", "true");
  veil.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:9999",
    "display:grid",
    "place-items:center",
    "background:rgba(7,15,30,0.92)",
    "color:#fff",
    "font:600 13px/1.4 'Space Grotesk',sans-serif",
    "letter-spacing:.14em",
    "text-transform:uppercase",
    "transition:opacity .18s ease",
  ].join(";");
  veil.textContent = "Translating…";
  document.body.appendChild(veil);

  window.setTimeout(() => window.location.reload(), 180);
}

/** Restore document language/direction on first paint. */
export function syncDocumentLanguage() {
  if (typeof document === "undefined") return;
  const lang = currentLanguage();
  document.documentElement.lang = lang;
  if (languageOf(lang).dir === "rtl") document.documentElement.dir = "rtl";
  else document.documentElement.removeAttribute("dir");
}
