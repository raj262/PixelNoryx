<?php

namespace App\Services\AutoBlog;

use App\Models\Post;
use Illuminate\Support\Str;

class DuplicateChecker
{
    /**
     * @return array{is_duplicate: bool, reason: ?string, matched_slug: ?string, score: float}
     */
    public function check(string $title, string $slug, ?string $topic = null, float $threshold = 0.72): array
    {
        $slug = Str::slug($slug ?: $title);

        if (Post::query()->where('slug', $slug)->exists()) {
            return [
                'is_duplicate' => true,
                'reason' => 'Exact slug already exists.',
                'matched_slug' => $slug,
                'score' => 1.0,
            ];
        }

        if (Post::query()->whereRaw('LOWER(title) = ?', [mb_strtolower(trim($title))])->exists()) {
            return [
                'is_duplicate' => true,
                'reason' => 'Exact title already exists.',
                'matched_slug' => null,
                'score' => 1.0,
            ];
        }

        $recent = Post::query()
            ->orderByDesc('id')
            ->limit(80)
            ->get(['id', 'title', 'slug', 'excerpt']);

        $bestScore = 0.0;
        $matchedSlug = null;

        foreach ($recent as $post) {
            $score = max(
                $this->similarity($title, (string) $post->title),
                $this->similarity($slug, (string) $post->slug),
            );

            if ($topic && filled($post->excerpt)) {
                $score = max($score, $this->similarity($topic, (string) $post->title) * 0.9);
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $matchedSlug = $post->slug;
            }
        }

        if ($bestScore >= $threshold) {
            return [
                'is_duplicate' => true,
                'reason' => 'Too similar to an existing post.',
                'matched_slug' => $matchedSlug,
                'score' => round($bestScore, 3),
            ];
        }

        return [
            'is_duplicate' => false,
            'reason' => null,
            'matched_slug' => null,
            'score' => round($bestScore, 3),
        ];
    }

    protected function similarity(string $a, string $b): float
    {
        $a = mb_strtolower(trim($a));
        $b = mb_strtolower(trim($b));

        if ($a === '' || $b === '') {
            return 0.0;
        }

        similar_text($a, $b, $percent);

        return $percent / 100;
    }
}
