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

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return self::rewriteLocalHost($path);
        }

        self::ensurePublicCopy($path);

        return self::rewriteLocalHost(Storage::disk('public')->url($path));
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

        return $appUrl.$path;
    }
}
