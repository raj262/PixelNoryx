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

        return Storage::disk('public')->url($path);
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
