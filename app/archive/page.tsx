import type { Metadata } from "next";
import ArchivePageClient from "./ArchivePageClient";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse all past PixelNoryx newsletter issues — free to read.",
};

export default function ArchivePage() {
  return <ArchivePageClient />;
}
