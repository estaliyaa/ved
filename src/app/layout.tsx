import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VED — AI-платформа для участников ВЭД",
  description:
    "AI-First платформа для внешнеэкономической деятельности. Опишите задачу простыми словами — система сама подберёт нужные данные и инструменты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={openSans.variable}>
      <body>{children}</body>
    </html>
  );
}
