import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedbackButton } from "@/components/FeedbackButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "НЕВБЛОК — Производство газосиликатных блоков",
  description: "ООО «НЕВБЛОК». Производство газосиликатных блоков. ФБС, кольца ЖБИ, шлакоблок, полублок, крышки и днища ЖБИ. Г. Невинномысск.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FeedbackButton />
      </body>
    </html>
  );
}
