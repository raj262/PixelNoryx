import Link from "next/link";

export default function NotFound() {
  return (
    <div className="magazine-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="section-subtitle">404</p>
      <h1 className="section-title mt-2">Page not found</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link href="/" className="btn-modern mt-8">
        Back to home
      </Link>
    </div>
  );
}
