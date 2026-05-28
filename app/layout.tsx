import type { Metadata } from "next";
import { Outfit, Source_Serif_4, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientShell from "@/components/layout/ClientShell";
import { fetchSeo } from "@/lib/api";
import { buildSiteMetadata } from "@/lib/seo";

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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeo();
  return buildSiteMetadata(seo, {
    title: seo?.home.title,
    description: seo?.home.description,
    keywords: seo?.home.keywords,
    path: "/",
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${outfit.variable} ${spaceGrotesk.variable} ${sourceSerif.variable}`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TopBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ClientShell />
      </body>
    </html>
  );
}
