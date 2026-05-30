<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class MediaUrl
{
    /**
     * Public storage URL — rewrites localhost dev URLs to APP_URL.
     */
    public static function public(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        $relative = self::normalizeStoredPath($path);

        if ($relative === null || $relative === '') {
            return self::rewriteLocalHost($path);
        }

        self::ensurePublicCopy($relative);

        return self::rewriteLocalHost(Storage::disk('public')->url($relative));
    }

    /**
     * Convert DB value to a storage-relative path (e.g. posts/file.png).
     */
    public static function normalizeStoredPath(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        $path = trim($path);

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $storagePath = parse_url($path, PHP_URL_PATH) ?? '';

            if (preg_match('#^/storage/(.+)$#', $storagePath, $matches)) {
                return $matches[1];
            }

            return $path;
        }

        return ltrim($path, '/');
    }

    /**
     * Filament used the default (private) disk before ->disk('public') was set.
     */
    public static function ensurePublicCopy(string $path): void
    {
        if ($path === '' || Storage::disk('public')->exists($path)) {
            return;
        }

        if (! Storage::disk('local')->exists($path)) {
            return;
        }

        Storage::disk('public')->put($path, Storage::disk('local')->get($path));
    }

    public static function rewriteLocalHost(string $url): string
    {
        $host = parse_url($url, PHP_URL_HOST);

        if (! in_array($host, ['127.0.0.1', 'localhost'], true)) {
            return $url;
        }

        $path = parse_url($url, PHP_URL_PATH) ?? '';
        $appUrl = rtrim((string) config('app.url'), '/');

        if (in_array(parse_url($appUrl, PHP_URL_HOST), ['127.0.0.1', 'localhost'], true)) {
            $fallback = env('MEDIA_PUBLIC_URL');
            if (is_string($fallback) && $fallback !== '') {
                $appUrl = rtrim($fallback, '/');
            }
        }

        return $appUrl.$path;
    }
}
