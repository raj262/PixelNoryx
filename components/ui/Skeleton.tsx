import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/[0.06]",
        className
      )}
    />
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32">
      <Skeleton className="mx-auto h-8 w-48 lg:mx-0" />
      <Skeleton className="mt-6 h-16 w-full max-w-2xl lg:mx-0" />
      <Skeleton className="mt-4 h-6 w-full max-w-xl lg:mx-0" />
      <div className="mt-8 flex gap-4">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
