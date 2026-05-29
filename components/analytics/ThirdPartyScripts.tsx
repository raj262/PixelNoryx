import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

/** GTM in <html> (per Next.js docs). */
export function ThirdPartyHead() {
  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}

/** GA at end of <html> when GTM is not used. */
export function ThirdPartyFoot() {
  if (gtmId || !gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
