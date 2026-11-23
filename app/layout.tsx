import type { Metadata } from "next";
import { headers } from "next/headers";
import { Outfit, Source_Serif_4, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientShell from "@/components/layout/ClientShell";
import AppProviders from "@/components/providers/AppProviders";
import { SiteDataProvider } from "@/components/providers/SiteDataProvider";
import { getBootstrap, fetchSeo, buildFallbackBootstrap } from "@/lib/cms";
import { ADSENSE_CLIENT_ID, ADSENSE_SCRIPT_SRC } from "@/lib/adsense";
import { buildSiteMetadata } from "@/lib/seo";
import { ThirdPartyFoot, ThirdPartyHead } from "@/components/analytics/ThirdPartyScripts";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-pixelnoryx-admin") === "1";

  if (isAdmin) {
    return (
      <html
        lang="en"
        suppressHydrationWarning
        className={`${outfit.variable} ${spaceGrotesk.variable} ${sourceSerif.variable}`}
      >
        <body className="font-sans antialiased" suppressHydrationWarning>
          {children}
        </body>
      </html>
    );
  }

  const siteData = await getBootstrap().catch(() => buildFallbackBootstrap());

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${outfit.variable} ${spaceGrotesk.variable} ${sourceSerif.variable}`}
    >
      <head>
        {ADSENSE_CLIENT_ID ? (
          <script async src={ADSENSE_SCRIPT_SRC} crossOrigin="anonymous" />
        ) : null}
        <ThirdPartyHead />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SiteDataProvider data={siteData}>
          <AppProviders>
            <TopBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ClientShell />
          </AppProviders>
        </SiteDataProvider>
      </body>
      <ThirdPartyFoot />
    </html>
  );
}
