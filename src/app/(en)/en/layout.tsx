import type { Viewport } from "next";
import RootLayout from "@/components/RootLayout";
export const metadata = { title: "Mahjong Tsujigiri!", description: "Sharpen your riichi mahjong skills with 60-second discard and fu challenges." };
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ネイティブで safe-area-inset-* を読めるようにする。globals.css の body 側で使う。
  viewportFit: "cover",
};
export default function Layout({children}: {children: React.ReactNode}) {return <RootLayout locale="en">{children}</RootLayout>;}
