import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import GoogleAdSense from "@/components/analytics/GoogleAdSense";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

/** GTM + AdSense in <html> (per Next.js / Google docs). */
export function ThirdPartyHead() {
  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <GoogleAdSense />
    </>
  );
}

/** Analytics at end of <html>. */
export function ThirdPartyFoot() {
  return (
    <>
      {!gtmId && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      <MicrosoftClarity />
    </>
  );
}
