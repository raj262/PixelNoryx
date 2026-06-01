<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
| Site root → Filament admin login (no redirect loop after auth).
| Dashboard lives at /admin once logged in.
*/
Route::redirect('/', '/admin/login');

/*
| Shared-hosting fallback: serve public uploads without storage symlink.
| Uses storage/app/public when /public/storage is unavailable or blocked.
*/
Route::get('/media/{path}', function (string $path) {
    if ($path === '' || str_contains($path, '..')) {
        abort(404);
    }

    $disk = Storage::disk('public');

    if (! $disk->exists($path)) {
        abort(404);
    }

    $filePath = $disk->path($path);

    if (! is_file($filePath)) {
        abort(404);
    }

    return response()->file($filePath, [
        'Cache-Control' => 'public, max-age=31536000, immutable',
    ]);
})->where('path', '.*');
