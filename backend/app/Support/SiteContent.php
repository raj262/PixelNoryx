<?php

namespace App\Support;

use App\Models\AdPlacement;
use App\Services\Ai\AiService;
use App\Models\Category;
use App\Models\Faq;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Support\MediaUrl;
use App\Models\Testimonial;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Storage;

class SiteContent
{
    public static function defaults(): array
    {
        return [
            'author_name' => 'Rajesh Verma',
            'author_role' => 'Founder & Editor',
            'author_bio' => 'Full-stack developer building ecommerce systems and teaching 25K+ developers how to ship faster.',
            'author_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            'contact_email' => 'designer.rajesh567@gmail.com',
            'whatsapp_enabled' => false,
            'whatsapp_number' => '',
            'whatsapp_display' => '',
            'whatsapp_message' => 'Hi! I have a question about PixelNoryx.',
            'ai_chat_enabled' => '1',
            'ai_chat_label' => 'PixelNoryx AI',
            'community_size' => '25K+',
            'social_stats' => [
                ['label' => 'Facebook', 'count' => '3K', 'href' => 'https://facebook.com'],
                ['label' => 'Twitter', 'count' => '3K', 'href' => 'https://twitter.com'],
                ['label' => 'YouTube', 'count' => '740', 'href' => 'https://youtube.com'],
                ['label' => 'Instagram', 'count' => '3K', 'href' => 'https://instagram.com'],
            ],
            'social_links' => [
                ['label' => 'Twitter', 'href' => 'https://twitter.com', 'icon' => 'Twitter'],
                ['label' => 'GitHub', 'href' => 'https://github.com', 'icon' => 'Github'],
                ['label' => 'LinkedIn', 'href' => 'https://linkedin.com', 'icon' => 'Linkedin'],
                ['label' => 'YouTube', 'href' => 'https://youtube.com', 'icon' => 'Youtube'],
            ],
            'nav_links' => [
                ['label' => 'Home', 'href' => '/', 'hasDropdown' => false],
                ['label' => 'Features', 'href' => '/features', 'hasDropdown' => false],
                ['label' => 'Categories', 'href' => '/archive', 'hasDropdown' => true],
                ['label' => 'About', 'href' => '/#about', 'hasDropdown' => false],
                ['label' => 'Contact', 'href' => '/#contact', 'hasDropdown' => false],
            ],
            'footer_links' => [
                'newsletter' => [
                    ['label' => 'Archive', 'href' => '/archive'],
                    ['label' => 'Subscribe', 'href' => '/#subscribe'],
                    ['label' => 'About', 'href' => '/#about'],
                ],
                'topics' => [
                    ['label' => 'React.js', 'href' => '/archive?topic=React.js'],
                    ['label' => 'Laravel', 'href' => '/archive?topic=Laravel'],
                    ['label' => 'SaaS', 'href' => '/archive?topic=SaaS'],
                    ['label' => 'UI/UX', 'href' => '/archive?topic=UI/UX'],
                ],
                'legal' => [
                    ['label' => 'Privacy', 'href' => '#'],
                    ['label' => 'Terms', 'href' => '#'],
                    ['label' => 'Contact', 'href' => '/#contact'],
                ],
            ],
            'subscribe_benefits' => [
                ['icon' => 'Zap', 'title' => '5-Minute Reads', 'description' => 'Concise, actionable insights — no fluff, no endless scroll.'],
                ['icon' => 'Code', 'title' => 'Real Code Snippets', 'description' => 'Copy-paste examples for React, Laravel, and modern APIs.'],
                ['icon' => 'TrendingUp', 'title' => 'Ship Faster', 'description' => 'Templates, tools, and tactics used by top indie hackers.'],
                ['icon' => 'Gift', 'title' => 'Free Forever', 'description' => 'No paywall on core issues. Premium extras optional later.'],
            ],
        ];
    }

    public static function aiPayload(): array
    {
        $service = app(AiService::class);
        $configured = $service->isConfigured();
        $chatEnabled = SiteSetting::get('ai_chat_enabled', '1') === '1';

        return [
            'enabled' => $chatEnabled,
            'configured' => $configured,
            'ready' => $configured && $chatEnabled,
            'model' => config('ai.model'),
            'provider' => config('ai.provider'),
            'label' => SiteSetting::get('ai_chat_label', 'PixelNoryx AI'),
        ];
    }

    public static function whatsappPayload(): array
    {
        $d = self::defaults();
        $enabled = filter_var(
            SiteSetting::get('whatsapp_enabled', $d['whatsapp_enabled'] ? '1' : '0'),
            FILTER_VALIDATE_BOOLEAN
        );
        $number = preg_replace('/\D+/', '', (string) SiteSetting::get('whatsapp_number', $d['whatsapp_number']));
        $message = (string) SiteSetting::get('whatsapp_message', $d['whatsapp_message']);
        $display = (string) SiteSetting::get('whatsapp_display', $d['whatsapp_display']);

        $active = $enabled && strlen($number) >= 10;
        $url = $active
            ? 'https://wa.me/'.$number.(filled($message) ? '?text='.rawurlencode($message) : '')
            : null;

        return [
            'enabled' => $active,
            'number' => $number,
            'displayNumber' => $display !== '' ? $display : $number,
            'message' => $message,
            'url' => $url,
        ];
    }

    public static function settingsPayload(): array
    {
        $d = self::defaults();
        $image = SiteSetting::get('author_image', $d['author_image']);
        $image = MediaUrl::public($image);

        return [
            'name' => SiteSetting::get('site_name', 'PixelNoryx'),
            'tagline' => SiteSetting::get('tagline', 'The Developer Dispatch'),
            'description' => SiteSetting::get('description', ''),
            'subscriberCount' => SiteSetting::get('subscriber_count', '12,400+'),
            'frequency' => SiteSetting::get('frequency', 'Every Tuesday'),
            'contactEmail' => SiteSetting::get('contact_email', $d['contact_email']),
            'communitySize' => SiteSetting::get('community_size', $d['community_size']),
            'author' => [
                'name' => SiteSetting::get('author_name', $d['author_name']),
                'role' => SiteSetting::get('author_role', $d['author_role']),
                'bio' => SiteSetting::get('author_bio', $d['author_bio']),
                'image' => $image,
            ],
            'socialStats' => SiteSetting::getJson('social_stats', $d['social_stats']),
            'socialLinks' => SiteSetting::getJson('social_links', $d['social_links']),
            'navLinks' => SiteSetting::getJson('nav_links', $d['nav_links']),
            'footerLinks' => SiteSetting::getJson('footer_links', $d['footer_links']),
            'subscribeBenefits' => SiteSetting::getJson('subscribe_benefits', $d['subscribe_benefits']),
        ];
    }

    public static function categoriesPayload(): array
    {
        return Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['name', 'slug'])
            ->map(fn ($c) => [
                'name' => $c->name,
                'slug' => $c->slug,
                'href' => '/archive?topic='.urlencode($c->name),
            ])
            ->values()
            ->all();
    }

    public static function adsPayload(): array
    {
        $ads = AdPlacement::query()
            ->visibleNow()
            ->orderBy('sort_order')
            ->get();

        $payload = [];
        foreach ($ads as $ad) {
            $payload[$ad->placement_key] = [
                'id' => $ad->placement_key,
                'size' => $ad->size,
                'title' => $ad->title,
                'subtitle' => $ad->subtitle,
                'cta' => $ad->cta,
                'href' => $ad->href,
                'sponsor' => $ad->sponsor,
                'gradient' => $ad->gradient_key,
            ];
        }

        return $payload;
    }

    public static function bootstrapPayload(): array
    {
        $posts = Post::query()
            ->published()
            ->with(['category', 'author', 'tags'])
            ->orderByDesc('published_at')
            ->limit(100)
            ->get();

        $faqs = Faq::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['question', 'answer']);

        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return [
            'settings' => self::settingsPayload(),
            'categories' => self::categoriesPayload(),
            'topics' => collect(self::categoriesPayload())->pluck('name')->values()->all(),
            'posts' => PostResource::collection($posts)->resolve(),
            'faqs' => $faqs->map(fn ($f) => [
                'question' => $f->question,
                'answer' => $f->answer,
            ])->values()->all(),
            'testimonials' => $testimonials->map(fn ($t) => [
                'name' => $t->name,
                'role' => $t->role,
                'content' => $t->content,
                'image' => MediaUrl::public($t->image),
                'avatar' => strtoupper(substr($t->name, 0, 1).substr(strstr($t->name, ' ') ?: '', 1, 1)),
                'rating' => $t->rating,
            ])->values()->all(),
            'ads' => self::adsPayload(),
            'ai' => self::aiPayload(),
            'whatsapp' => self::whatsappPayload(),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function saveChatbotSettings(array $data): void
    {
        if (array_key_exists('ai_chat_enabled', $data)) {
            SiteSetting::set(
                'ai_chat_enabled',
                filter_var($data['ai_chat_enabled'], FILTER_VALIDATE_BOOLEAN) ? '1' : '0'
            );
        }

        if (array_key_exists('ai_chat_label', $data)) {
            SiteSetting::set('ai_chat_label', (string) ($data['ai_chat_label'] ?? 'PixelNoryx AI'));
        }
    }

    public static function saveFromAdminForm(array $data): void
    {
        self::saveChatbotSettings($data);

        $keys = [
            'site_name', 'tagline', 'description', 'subscriber_count', 'frequency',
            'contact_email', 'community_size', 'author_name', 'author_role', 'author_bio', 'author_image',
            'whatsapp_enabled', 'whatsapp_number', 'whatsapp_display', 'whatsapp_message',
        ];

        foreach ($keys as $key) {
            if (! array_key_exists($key, $data)) {
                continue;
            }

            $value = $data[$key] ?? '';

            if ($key === 'whatsapp_enabled') {
                SiteSetting::set($key, filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0');

                continue;
            }

            if ($key === 'whatsapp_number' && is_string($value)) {
                SiteSetting::set($key, preg_replace('/\D+/', '', $value) ?? '');

                continue;
            }

            SiteSetting::set($key, is_scalar($value) ? (string) $value : '');
        }

        foreach (['social_stats', 'social_links', 'nav_links', 'footer_links', 'subscribe_benefits'] as $jsonKey) {
            if (array_key_exists($jsonKey, $data) && is_array($data[$jsonKey])) {
                SiteSetting::setJson($jsonKey, $data[$jsonKey]);
            }
        }
    }

    public static function adminFormData(): array
    {
        $settings = self::settingsPayload();

        return [
            'site_name' => $settings['name'],
            'tagline' => $settings['tagline'],
            'description' => $settings['description'],
            'subscriber_count' => $settings['subscriberCount'],
            'frequency' => $settings['frequency'],
            'contact_email' => $settings['contactEmail'],
            'community_size' => $settings['communitySize'],
            'author_name' => $settings['author']['name'],
            'author_role' => $settings['author']['role'],
            'author_bio' => $settings['author']['bio'],
            'author_image' => SiteSetting::get('author_image', self::defaults()['author_image']),
            'social_stats' => $settings['socialStats'],
            'social_links' => $settings['socialLinks'],
            'nav_links' => $settings['navLinks'],
            'footer_links' => $settings['footerLinks'],
            'subscribe_benefits' => $settings['subscribeBenefits'],
            'whatsapp_enabled' => SiteSetting::get('whatsapp_enabled', '0') === '1',
            'whatsapp_number' => SiteSetting::get('whatsapp_number', ''),
            'whatsapp_display' => SiteSetting::get('whatsapp_display', ''),
            'whatsapp_message' => SiteSetting::get('whatsapp_message', self::defaults()['whatsapp_message']),
            'ai_chat_enabled' => SiteSetting::get('ai_chat_enabled', '1') === '1',
            'ai_chat_label' => SiteSetting::get('ai_chat_label', 'PixelNoryx AI'),
        ];
    }
}
