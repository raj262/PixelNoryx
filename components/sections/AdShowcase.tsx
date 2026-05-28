"use client";

import { adPlacements } from "@/lib/ads";
import AdSlot from "@/components/ads/AdSlot";
import AnimateIn from "@/components/ui/AnimateIn";

interface AdShowcaseProps {
  placementKey: keyof typeof adPlacements;
  label?: string;
}

export default function AdShowcase({
  placementKey,
  label = "Advertisement",
}: AdShowcaseProps) {
  const ad = adPlacements[placementKey];
  if (!ad) return null;

  return (
    <section className="py-8">
      <div className="magazine-container">
        <AnimateIn>
          <p className="ad-slot-label">{label}</p>
          <AdSlot ad={ad} animate={false} />
        </AnimateIn>
      </div>
    </section>
  );
}
