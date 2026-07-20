<?php

namespace App\Services\AutoBlog;

use App\Models\KeywordPoolItem;
use App\Models\Post;
use App\Services\Ai\AiService;
use Illuminate\Support\Str;

class TopicResearchService
{
    public function __construct(protected AiService $ai) {}

    /**
     * @return array{topic: string, angle: string, outline: list<string>, target_keywords: list<string>, category_hint: ?string}
     */
    public function research(KeywordPoolItem $keyword): array
    {
        $recentTitles = Post::query()
            ->orderByDesc('id')
            ->limit(25)
            ->pluck('title')
            ->all();

        $result = $this->ai->generate('topic_research', sprintf(
            "Seed keyword: %s\nPreferred category: %s\nAvoid overlapping these existing titles:\n- %s",
            $keyword->keyword,
            $keyword->category?->name ?? 'auto-pick best fit',
            implode("\n- ", $recentTitles ?: ['(none yet)'])
        ), [
            'keyword' => $keyword->keyword,
            'notes' => $keyword->notes,
        ]);

        $topic = trim((string) ($result['topic'] ?? $result['title'] ?? $keyword->keyword));
        $angle = trim((string) ($result['angle'] ?? $result['unique_angle'] ?? ''));
        $outline = array_values(array_filter(array_map('strval', $result['outline'] ?? [])));
        $targetKeywords = array_values(array_filter(array_map('strval', $result['target_keywords'] ?? [$keyword->keyword])));

        if ($topic === '') {
            $topic = $keyword->keyword;
        }

        if ($angle === '') {
            $angle = 'Practical developer guide with concrete examples';
        }

        if ($outline === []) {
            $outline = [
                'Introduction and why this matters',
                'Core concepts',
                'Step-by-step implementation',
                'Common mistakes',
                'Conclusion and next steps',
            ];
        }

        return [
            'topic' => $topic,
            'angle' => $angle,
            'outline' => $outline,
            'target_keywords' => $targetKeywords,
            'category_hint' => filled($result['category_hint'] ?? null)
                ? (string) $result['category_hint']
                : ($keyword->category?->name),
            'proposed_title' => (string) ($result['proposed_title'] ?? $topic),
            'proposed_slug' => Str::slug((string) ($result['proposed_slug'] ?? $result['proposed_title'] ?? $topic)),
        ];
    }
}
