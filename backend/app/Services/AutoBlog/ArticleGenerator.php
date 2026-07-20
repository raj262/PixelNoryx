<?php

namespace App\Services\AutoBlog;

use App\Models\KeywordPoolItem;
use App\Services\Ai\AiService;
use Illuminate\Support\Str;

class ArticleGenerator
{
    public function __construct(protected AiService $ai) {}

    /**
     * @param  array<string, mixed>  $research
     * @return array<string, mixed>
     */
    public function generate(KeywordPoolItem $keyword, array $research, int $minWords = 1200, int $maxWords = 2000): array
    {
        $article = $this->ai->generate('daily_article', sprintf(
            "Write a complete SEO blog article for PixelNoryx.\nKeyword: %s\nTopic: %s\nUnique angle: %s\nTarget length: %d–%d words.\nOutline:\n- %s\nTarget keywords: %s",
            $keyword->keyword,
            $research['topic'],
            $research['angle'],
            $minWords,
            $maxWords,
            implode("\n- ", $research['outline'] ?? []),
            implode(', ', $research['target_keywords'] ?? [$keyword->keyword])
        ), [
            'keyword' => $keyword->keyword,
            'research' => $research,
            'min_words' => $minWords,
            'max_words' => $maxWords,
        ], maxTokens: 8192);

        $title = trim((string) ($article['title'] ?? $research['proposed_title'] ?? $research['topic']));
        $slug = Str::slug((string) ($article['slug'] ?? $title));

        $faqs = $this->normalizeFaqs($article['faqs'] ?? []);
        $content = (string) ($article['content'] ?? '');
        $content = $this->appendFaqsToContent($content, $faqs);

        $tags = array_values(array_filter(array_map('strval', $article['tags'] ?? [])));
        if ($tags === []) {
            $tags = array_slice($research['target_keywords'] ?? [$keyword->keyword], 0, 4);
        }

        $metaKeywords = (string) ($article['meta_keywords'] ?? implode(', ', $tags));

        return [
            'title' => $title,
            'slug' => $slug,
            'excerpt' => trim((string) ($article['excerpt'] ?? '')),
            'preview' => trim((string) ($article['preview'] ?? $article['excerpt'] ?? '')),
            'content' => $content,
            'faqs' => $faqs,
            'read_time' => (string) ($article['read_time'] ?? $this->estimateReadTime($content)),
            'meta_title' => Str::limit(trim((string) ($article['meta_title'] ?? $title)), 70, ''),
            'meta_description' => Str::limit(trim((string) ($article['meta_description'] ?? '')), 170, ''),
            'meta_keywords' => $metaKeywords,
            'tags' => $tags,
            'category_hint' => (string) ($article['category'] ?? $research['category_hint'] ?? ''),
        ];
    }

    /**
     * @param  mixed  $faqs
     * @return list<array{question: string, answer: string}>
     */
    protected function normalizeFaqs(mixed $faqs): array
    {
        if (! is_array($faqs)) {
            return [];
        }

        $out = [];
        foreach ($faqs as $faq) {
            if (! is_array($faq)) {
                continue;
            }
            $q = trim((string) ($faq['question'] ?? ''));
            $a = trim((string) ($faq['answer'] ?? ''));
            if ($q === '' || $a === '') {
                continue;
            }
            $out[] = ['question' => $q, 'answer' => $a];
        }

        return array_slice($out, 0, 8);
    }

    /**
     * @param  list<array{question: string, answer: string}>  $faqs
     */
    protected function appendFaqsToContent(string $content, array $faqs): string
    {
        if ($faqs === [] || str_contains(mb_strtolower($content), 'frequently asked')) {
            return $content;
        }

        $html = '<h2>Frequently Asked Questions</h2>';
        foreach ($faqs as $faq) {
            $html .= '<h3>'.e($faq['question']).'</h3>';
            $html .= '<p>'.e($faq['answer']).'</p>';
        }

        return rtrim($content)."\n".$html;
    }

    protected function estimateReadTime(string $content): string
    {
        $words = max(1, str_word_count(strip_tags($content)));
        $minutes = max(1, (int) ceil($words / 200));

        return "{$minutes} min read";
    }
}
