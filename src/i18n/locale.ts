export type Locale = "ja" | "en";
export const LOCALE_KEY = "tsujigiri_locale";
export function localePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const path = href.replace(/^\/en(?=\/|[?#]|$)/, "") || "/";
  return locale === "en" ? "/en" + (path.startsWith("/") ? path : "/" + path) : path.startsWith("/") ? path : "/" + path;
}
export function preferredLocale(saved: string | null, languages: readonly string[]): Locale {
  if (saved === "ja" || saved === "en") return saved;
  return languages[0]?.toLowerCase().startsWith("ja") ? "ja" : "en";
}
export function browserLocale(): Locale {
  return typeof window !== "undefined" && /^\/en(?:\/|$)/.test(window.location.pathname) ? "en" : "ja";
}
