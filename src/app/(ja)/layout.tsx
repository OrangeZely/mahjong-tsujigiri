import type { Viewport } from "next";
import RootLayout from "@/components/RootLayout";
export const metadata = { title: "麻雀 辻斬る！", description: "1分間で何切る問題を斬りまくれ！" };
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ネイティブで safe-area-inset-* を読めるようにする。globals.css の body 側で使う。
  viewportFit: "cover",
};
export default function Layout({children}: {children: React.ReactNode}) {return <RootLayout locale="ja">{children}</RootLayout>;}
