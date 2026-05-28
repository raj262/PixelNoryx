import type { Metadata } from "next";
import { Outfit, Source_Serif_4, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientShell from "@/components/layout/ClientShell";
import { siteConfig } from "@/lib/data";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `PixelNoryx | ${siteConfig.tagline}`,
    template: "%s | PixelNoryx",
  },
  description: siteConfig.description,
  keywords: ["tech magazine", "developer blog", "newsletter", "react", "laravel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} ${sourceSerif.variable} font-sans antialiased`}
      >
        <TopBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ClientShell />
      </body>
    </html>
  );
}
