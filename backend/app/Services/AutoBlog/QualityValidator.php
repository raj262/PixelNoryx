<?php

namespace App\Services\AutoBlog;

use Illuminate\Support\Str;

class QualityValidator
{
    /**
     * @param  array<string, mixed>  $article
     * @param  array{min_words: int, max_words: int}  $limits
     * @return array{ok: bool, errors: list<string>, warnings: list<string>, word_count: int}
     */
    public function validate(array $article, array $limits): array
    {
        $errors = [];
        $warnings = [];

        foreach (['title', 'slug', 'excerpt', 'content', 'meta_title', 'meta_description'] as $field) {
            if (! filled($article[$field] ?? null)) {
                $errors[] = "Missing required field: {$field}";
            }
        }

        $content = (string) ($article['content'] ?? '');
        $wordCount = str_word_count(strip_tags($content));

        if ($wordCount < $limits['min_words']) {
            $errors[] = "Content too short ({$wordCount} words, min {$limits['min_words']}).";
        }

        if ($wordCount > $limits['max_words'] + 400) {
            $warnings[] = "Content is longer than target ({$wordCount} words).";
        }

        $metaTitle = (string) ($article['meta_title'] ?? '');
        if (strlen($metaTitle) > 70) {
            $warnings[] = 'meta_title is longer than 70 characters.';
        }

        $metaDescription = (string) ($article['meta_description'] ?? '');
        if (strlen($metaDescription) > 170) {
            $warnings[] = 'meta_description is longer than 170 characters.';
        }

        $slug = (string) ($article['slug'] ?? '');
        if ($slug !== '' && $slug !== Str::slug($slug)) {
            $errors[] = 'Slug is not valid kebab-case.';
        }

        $faqs = $article['faqs'] ?? [];
        if (! is_array($faqs) || count($faqs) < 3) {
            $warnings[] = 'Fewer than 3 FAQs generated.';
        }

        return [
            'ok' => $errors === [],
            'errors' => $errors,
            'warnings' => $warnings,
            'word_count' => $wordCount,
        ];
    }
}
