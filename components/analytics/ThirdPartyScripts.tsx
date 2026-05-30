import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

/** GTM in <html> (per Next.js docs). */
export function ThirdPartyHead() {
  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
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
