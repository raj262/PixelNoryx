import { HeroSkeleton } from "@/components/ui/Skeleton";
import { BlogGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pt-24">
      <HeroSkeleton />
      <div className="section-padding mx-auto max-w-7xl">
        <BlogGridSkeleton count={6} />
      </div>
    </div>
  );
}
