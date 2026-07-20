<?php

namespace App\Services\AutoBlog;

use App\Models\AutoBlogRun;
use App\Models\Category;
use App\Models\KeywordPoolItem;
use App\Models\Post;
use App\Models\Tag;
use App\Support\AutoBlogSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class DailyPostPipeline
{
    public function __construct(
        protected KeywordPoolService $keywords,
        protected TopicResearchService $research,
        protected DuplicateChecker $duplicates,
        protected ArticleGenerator $generator,
        protected QualityValidator $validator,
    ) {}

    /**
     * @return array{ok: bool, skipped?: bool, message: string, run?: AutoBlogRun, post?: Post}
     */
    public function run(bool $force = false): array
    {
        $settings = AutoBlogSettings::all();

        if (! $force && ! ($settings['enabled'] ?? false)) {
            return [
                'ok' => false,
                'skipped' => true,
                'message' => 'Auto-blog is disabled. Enable it in Admin → Settings → Auto Blog, or pass --force.',
            ];
        }

        if (! $force && ($settings['skip_if_post_today'] ?? true)) {
            $runToday = AutoBlogRun::query()
                ->whereDate('created_at', today())
                ->where('status', 'saved')
                ->exists();

            if ($runToday) {
                return [
                    'ok' => true,
                    'skipped' => true,
                    'message' => 'A successful auto-blog run already exists for today.',
                ];
            }
        }

        $run = AutoBlogRun::query()->create([
            'status' => 'started',
        ]);

        try {
            $keyword = $this->keywords->next();
            $run->update([
                'keyword_pool_id' => $keyword->id,
                'status' => 'researching',
            ]);

            $research = $this->research->research($keyword);
            $run->update([
                'topic' => $research['topic'],
                'research' => $research,
                'title' => $research['proposed_title'] ?? $research['topic'],
                'slug' => $research['proposed_slug'] ?? null,
                'status' => 'generating',
            ]);

            $dupCheck = $this->duplicates->check(
                (string) ($research['proposed_title'] ?? $research['topic']),
                (string) ($research['proposed_slug'] ?? $research['topic']),
                $research['topic'],
                (float) $settings['similarity_threshold']
            );

            if ($dupCheck['is_duplicate']) {
                // Try once more with a forced alternate angle
                $research['angle'] = ($research['angle'] ?? '').' — alternate angle focusing on practical trade-offs and 2026 tooling';
                $research['proposed_title'] = trim(($research['proposed_title'] ?? $research['topic']).' (Practical Guide)');
                $research['proposed_slug'] = Str::slug($research['proposed_title']).'-'.now()->format('Ymd');
            }

            $article = $this->generator->generate(
                $keyword,
                $research,
                (int) $settings['min_words'],
                (int) $settings['max_words']
            );

            $finalDup = $this->duplicates->check(
                $article['title'],
                $article['slug'],
                $research['topic'],
                (float) $settings['similarity_threshold']
            );

            if ($finalDup['is_duplicate']) {
                $article['slug'] = Str::slug($article['slug']).'-'.now()->format('Ymd');
                $finalDup = $this->duplicates->check(
                    $article['title'],
                    $article['slug'],
                    $research['topic'],
                    (float) $settings['similarity_threshold']
                );
            }

            if ($finalDup['is_duplicate'] && ($finalDup['score'] ?? 0) >= 0.95) {
                throw new RuntimeException(
                    'Duplicate detected: '.($finalDup['reason'] ?? 'similar post').
                    ($finalDup['matched_slug'] ? ' (matched: '.$finalDup['matched_slug'].')' : '')
                );
            }

            $run->update(['status' => 'validating', 'title' => $article['title'], 'slug' => $article['slug']]);

            $validation = $this->validator->validate($article, [
                'min_words' => (int) $settings['min_words'],
                'max_words' => (int) $settings['max_words'],
            ]);

            $run->update([
                'validation' => $validation,
                'word_count' => $validation['word_count'],
            ]);

            if (! $validation['ok']) {
                throw new RuntimeException('Quality validation failed: '.implode(' ', $validation['errors']));
            }

            $status = ($settings['default_status'] ?? 'draft') === 'published' ? 'published' : 'draft';
            $post = $this->persist($keyword, $article, $status);

            $keyword->markUsed();

            $run->update([
                'status' => 'saved',
                'post_id' => $post->id,
                'published' => $status === 'published',
            ]);

            return [
                'ok' => true,
                'message' => "Saved {$status} post: {$post->title}",
                'run' => $run->fresh(),
                'post' => $post,
            ];
        } catch (Throwable $e) {
            $run->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);

            return [
                'ok' => false,
                'message' => $e->getMessage(),
                'run' => $run->fresh(),
            ];
        }
    }

    /**
     * @param  array<string, mixed>  $article
     */
    protected function persist(KeywordPoolItem $keyword, array $article, string $status): Post
    {
        return DB::transaction(function () use ($keyword, $article, $status) {
            $categoryId = $keyword->category_id
                ?? $this->resolveCategoryId((string) ($article['category_hint'] ?? ''))
                ?? AutoBlogSettings::all()['default_category_id']
                ?? Category::query()->where('is_active', true)->orderBy('sort_order')->value('id');

            if (! $categoryId) {
                throw new RuntimeException('No category available. Create at least one active category.');
            }

            $authorId = AutoBlogSettings::resolveAuthorId();
            $issue = ((int) Post::query()->max('issue_number')) + 1;

            $metaKeywords = trim((string) ($article['meta_keywords'] ?? ''));
            if (! str_contains(mb_strtolower($metaKeywords), 'auto-blog')) {
                $metaKeywords = trim($metaKeywords.', auto-blog', ', ');
            }

            $post = Post::query()->create([
                'category_id' => $categoryId,
                'user_id' => $authorId,
                'issue_number' => $issue > 0 ? $issue : 1,
                'slug' => $article['slug'],
                'title' => $article['title'],
                'meta_title' => $article['meta_title'],
                'meta_description' => $article['meta_description'],
                'meta_keywords' => $metaKeywords,
                'excerpt' => $article['excerpt'],
                'preview' => $article['preview'] ?: $article['excerpt'],
                'content' => $article['content'],
                'faqs' => $article['faqs'] ?? [],
                'read_time' => $article['read_time'],
                'is_featured' => false,
                'is_free' => true,
                'is_sponsored' => false,
                'status' => $status,
                'published_at' => $status === 'published' ? now() : null,
            ]);

            $tagIds = [];
            foreach ($article['tags'] ?? [] as $tagName) {
                $name = trim((string) $tagName);
                if ($name === '') {
                    continue;
                }
                $tag = Tag::query()->firstOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name]
                );
                $tagIds[] = $tag->id;
            }
            if ($tagIds !== []) {
                $post->tags()->sync(array_unique($tagIds));
            }

            return $post->fresh(['category', 'tags', 'author']);
        });
    }

    protected function resolveCategoryId(string $hint): ?int
    {
        $hint = trim($hint);
        if ($hint === '') {
            return null;
        }

        $slug = Str::slug($hint);

        return Category::query()
            ->where('is_active', true)
            ->where(function ($q) use ($hint, $slug) {
                $q->where('slug', $slug)->orWhere('name', $hint);
            })
            ->value('id');
    }
}
