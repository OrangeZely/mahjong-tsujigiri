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

/**
 * ネイティブのWebViewが全ページ遷移で開けるURLに直す。
 *
 * Capacitorのアセット配信は拡張子のないパスを解決できない。iOSは既定でルートの
 * index.html を返し、Androidは html5mode を切ると404相当になる。どちらも
 * 静的書き出しの `/en/` に到達できない。拡張子付きのパスはそのまま配信されるので、
 * ネイティブでの全ページ遷移だけ index.html を直接指す。
 *
 * localePath は先頭の `/en` を落として組み立て直すので、`/en/index.html` を
 * 渡しても正しく往復する。アプリ内のリンク遷移はクライアントルーターが担うため、
 * この変換は全ページ遷移にだけ使う。
 */
export function staticExportHref(path: string): string {
  const [pathname, rest = ""] = [path.replace(/[?#].*$/, ""), path.slice(path.replace(/[?#].*$/, "").length)];
  if (/\.[^/]+$/.test(pathname)) return path;
  return pathname.replace(/\/?$/, "/") + "index.html" + rest;
}
