import RootLayout from "@/components/RootLayout";
export const metadata = { title: "Mahjong Tsujigiri!", description: "Sharpen your riichi mahjong skills with 60-second discard and fu challenges." };
export default function Layout({children}: {children: React.ReactNode}) {return <RootLayout locale="en">{children}</RootLayout>;}
