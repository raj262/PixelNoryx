/**
 * Laravel API base URL (includes /api/v1).
 * Set NEXT_PUBLIC_API_URL in the project root .env
 */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? "https://admin.rajeshcodes.in/api/v1";
  return raw.replace(/\/$/, "");
}
