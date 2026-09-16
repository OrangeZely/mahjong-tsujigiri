import RootLayout from "@/components/RootLayout";
export const metadata = { title: "麻雀 辻斬る！", description: "1分間で何切る問題を斬りまくれ！" };
export default function Layout({children}: {children: React.ReactNode}) {return <RootLayout locale="ja">{children}</RootLayout>;}
