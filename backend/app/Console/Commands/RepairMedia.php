<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\SiteSetting;
use App\Support\MediaUrl;
use Illuminate\Console\Command;

class RepairMedia extends Command
{
    protected $signature = 'media:repair {--dry-run : Show changes without saving}';

    protected $description = 'Fix localhost image paths in DB and copy private uploads to public storage';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $fixed = 0;

        foreach (Post::query()->get(['id', 'title', 'image', 'og_image']) as $post) {
            $image = MediaUrl::normalizeStoredPath($post->image);
            $ogImage = MediaUrl::normalizeStoredPath($post->og_image);

            if ($image !== $post->image || $ogImage !== $post->og_image) {
                $this->line("Post #{$post->id} {$post->title}");
                if ($post->image !== $image) {
                    $this->line("  image: {$post->image} → {$image}");
                }
                if ($post->og_image !== $ogImage) {
                    $this->line("  og_image: {$post->og_image} → {$ogImage}");
                }

                if (! $dryRun) {
                    $post->updateQuietly([
                        'image' => $image,
                        'og_image' => $ogImage,
                    ]);
                }

                $fixed++;
            }

            if (! $dryRun) {
                if (is_string($image) && $image !== '') {
                    MediaUrl::ensurePublicCopy($image);
                }
                if (is_string($ogImage) && $ogImage !== '') {
                    MediaUrl::ensurePublicCopy($ogImage);
                }
            }
        }

        foreach (['author_image', 'seo_og_image'] as $key) {
            $raw = SiteSetting::get($key);
            if (! is_string($raw) || $raw === '') {
                continue;
            }

            $normalized = MediaUrl::normalizeStoredPath($raw);
            if ($normalized === $raw) {
                continue;
            }

            $this->line("Setting {$key}: {$raw} → {$normalized}");

            if (! $dryRun) {
                SiteSetting::set($key, $normalized ?? '');
                if (is_string($normalized) && $normalized !== '') {
                    MediaUrl::ensurePublicCopy($normalized);
                }
            }

            $fixed++;
        }

        if ($fixed === 0) {
            $this->info('No media paths needed repair.');

            return self::SUCCESS;
        }

        $this->newLine();
        $this->info($dryRun
            ? "Would repair {$fixed} record(s). Run without --dry-run to apply."
            : "Repaired {$fixed} record(s). Run: php artisan storage:link if /storage URLs 404.");

        return self::SUCCESS;
    }
}
