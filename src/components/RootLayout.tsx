import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { LocaleProvider, LanguageControls } from "@/i18n/client";
import type { Locale } from "@/i18n/locale";
import AdPrivacyOptions from "@/components/AdPrivacyOptions";
import LiffInit from "@/components/LiffInit";
import RevenueCatInit from "@/components/RevenueCatInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children, locale,
}: Readonly<{
  children: React.ReactNode; locale: Locale;
}>) {
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale}>
        <LanguageControls />
        <AdPrivacyOptions />
        <LiffInit />
        <RevenueCatInit />
        {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
