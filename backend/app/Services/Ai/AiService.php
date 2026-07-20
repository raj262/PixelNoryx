<?php

namespace App\Services\Ai;

use App\Models\Faq;
use App\Models\Post;
use App\Services\Ai\Providers\GeminiProvider;
use App\Services\Ai\Providers\OpenAiProvider;
use App\Support\AiSettings;
use App\Support\SiteContent;
use Illuminate\Support\Str;
use RuntimeException;

class AiService
{
    public function __construct(
        protected GeminiProvider $gemini,
        protected OpenAiProvider $openAi,
    ) {}
    public function isConfigured(): bool
    {
        AiSettings::apply();

        return AiSettings::isConfigured();
    }

    public function status(): array
    {
        AiSettings::apply();

        return [
            'enabled' => AiSettings::isConfigured(),
            'model' => config('ai.model'),
            'provider' => config('ai.provider'),
        ];
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     */
    public function chat(array $messages, ?string $systemPrompt = null): string
    {
        $system = $systemPrompt ?? AiPrompts::siteAssistant($this->buildSiteContext());

        return $this->completion([
            ['role' => 'system', 'content' => $system],
            ...$messages,
        ]);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    public function generate(string $type, string $prompt, array $context = [], ?int $maxTokens = null): array
    {
        $system = match ($type) {
            'post_draft' => AiPrompts::postDraft(),
            'topic_research' => AiPrompts::topicResearch(),
            'daily_article' => AiPrompts::dailyArticle(),
            'faq' => AiPrompts::faq(),
            'ad_copy' => AiPrompts::adCopy(),
            'seo' => AiPrompts::seoImprove(),
            default => throw new RuntimeException('Unknown AI generate type.'),
        };

        $userContent = $prompt;
        if ($context !== []) {
            $userContent .= "\n\nContext:\n".json_encode($context, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        $raw = $this->completion([
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $userContent],
        ], json: $this->usesGemini(), maxTokens: $maxTokens);

        return $this->parseJsonResponse($raw);
    }

    public function buildSiteContext(): string
    {
        $settings = SiteContent::settingsPayload();
        $posts = Post::query()
            ->published()
            ->with('category')
            ->orderByDesc('published_at')
            ->limit(20)
            ->get();

        $lines = [
            'Site: '.$settings['name'].' — '.$settings['tagline'],
            'Description: '.$settings['description'],
            'Newsletter: '.$settings['frequency'].', '.$settings['subscriberCount'].' subscribers',
            'Contact: '.$settings['contactEmail'],
            'Topics: '.implode(', ', SiteContent::categoriesPayload() ? array_column(SiteContent::categoriesPayload(), 'name') : []),
            '',
            'Recent articles:',
        ];

        foreach ($posts as $post) {
            $lines[] = sprintf(
                '- [%s] %s — %s (topic: %s)',
                $post->slug,
                $post->title,
                Str::limit(strip_tags($post->excerpt ?? ''), 120),
                $post->category?->name ?? 'General'
            );
        }

        $faqs = Faq::query()->where('is_active', true)->orderBy('sort_order')->limit(8)->get();
        if ($faqs->isNotEmpty()) {
            $lines[] = '';
            $lines[] = 'FAQs:';
            foreach ($faqs as $faq) {
                $lines[] = '- Q: '.$faq->question.' A: '.Str::limit($faq->answer, 100);
            }
        }

        return implode("\n", $lines);
    }

    protected function usesGemini(): bool
    {
        return in_array(config('ai.provider'), ['gemini', 'google'], true);
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     */
    protected function completion(array $messages, bool $json = false, ?int $maxTokens = null): string
    {
        AiSettings::apply();

        if (! $this->isConfigured()) {
            throw new RuntimeException(
                $this->usesGemini()
                    ? 'AI is not configured. Add a Gemini API key in Admin → Settings → AI / ChatGPT.'
                    : 'AI is not configured. Add your ChatGPT (OpenAI) API key in Admin → Settings → AI / ChatGPT.'
            );
        }

        if ($this->usesGemini()) {
            return $this->gemini->complete($messages, $json, $maxTokens);
        }

        return $this->openAi->complete($messages, $maxTokens);
    }

    /**
     * @return array<string, mixed>
     */
    protected function parseJsonResponse(string $raw): array
    {
        $clean = trim($raw);
        $clean = preg_replace('/^```json\s*/i', '', $clean) ?? $clean;
        $clean = preg_replace('/^```\s*/', '', $clean) ?? $clean;
        $clean = preg_replace('/\s*```$/', '', $clean) ?? $clean;

        $decoded = json_decode($clean, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('AI did not return valid JSON. Try again with a clearer prompt.');
        }

        return $decoded;
    }
}
