"use client";
import { createContext, useCallback, useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter as useNextRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { LOCALE_KEY, localePath, preferredLocale, staticExportHref, type Locale } from "./locale";
import { translate } from "./translate";
import type { MessageKey } from "./messages";
const LocaleContext = createContext<Locale>("ja");
export function LocaleProvider({locale, children}: {locale: Locale; children: React.ReactNode}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export function useI18n() {
  const locale = useContext(LocaleContext);
  const t = useCallback((key: MessageKey, values?: Record<string, string | number>) => translate(locale, key, values), [locale]);
  return { locale, t };
}
export function useRouter() {
  const router = useNextRouter();
  const {locale} = useI18n();
  return {...router, push: (href: string) => router.push(localePath(href, locale)), replace: (href: string) => router.replace(localePath(href, locale))};
}
export function LocaleLink({href, ...props}: Omit<React.ComponentProps<typeof Link>, "href"> & {href: string}) {
  const {locale} = useI18n();
  return <Link {...props} href={localePath(href, locale)} />;
}
export function LanguageControls() {
  const {locale} = useI18n();
  const pathname = usePathname();
  useEffect(() => {
    // Native starts at /. Explicit web language URLs never redirect.
    if (Capacitor.isNativePlatform() && pathname === "/") {
      let saved: string | null = null;
      try { saved = localStorage.getItem(LOCALE_KEY); } catch {}
      if (preferredLocale(saved, navigator.languages) === "en") window.location.replace(staticExportHref("/en/") + window.location.search);
    }
  }, [pathname]);
  if (/\/(?:fu-game|game)\/?$/.test(pathname)) return null;
  return <nav aria-label={locale === "en" ? "Language" : "言語"} className="bg-gray-900 text-gray-300 flex justify-end gap-4 px-4 py-2 text-sm">
    {(["ja", "en"] as const).map((language) => <a key={language} lang={language} hrefLang={language} href={localePath(pathname, language)} aria-current={language === locale ? "true" : undefined} className={language === locale ? "font-bold text-yellow-300" : "underline"} onClick={(event) => {
      event.preventDefault();
      try { localStorage.setItem(LOCALE_KEY, language); } catch {}
      const target = localePath(pathname, language);
      window.location.assign((Capacitor.isNativePlatform() ? staticExportHref(target) : target) + window.location.search + window.location.hash);
    }}>{language === "ja" ? "日本語" : "English"}</a>)}
  </nav>;
}
