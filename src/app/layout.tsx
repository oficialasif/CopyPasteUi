import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StickyAd } from "@/components/ads/StickyAd";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { LikesProvider } from "@/contexts/LikesContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CopyPasteUI - Modern Component Library",
  description: "Free, open-source, component-based web UI library for developers.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900 dark:bg-[#030014] dark:text-gray-50`}
        suppressHydrationWarning
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        <AnimatedBackground />
        <LikesProvider>
          {children}
        </LikesProvider>
        <StickyAd />
      </body>
    </html>
  );
}
