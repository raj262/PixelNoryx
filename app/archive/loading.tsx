import { BlogGridSkeleton } from "@/components/ui/Skeleton";

export default function ArchiveLoading() {
  return (
    <div className="min-h-screen pt-28">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="mb-12 h-32 animate-pulse rounded-2xl bg-white/5" />
        <BlogGridSkeleton count={9} />
      </div>
    </div>
  );
}
