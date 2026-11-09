import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "전예지 — AI Engineer",
  description: "전예지의 연구와 프로젝트. MLLM, Computer Vision, Document VQA, Open Vocabulary Segmentation.",
  icons: { icon: "/favicon.svg" },
  openGraph: {title:"전예지 — AI Engineer",description:"MLLM · Computer Vision 연구와 프로젝트",type:"website",locale:"ko_KR"},
};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
  return <html lang="ko"><body>{children}</body></html>;
}
