<?php

namespace App\Support;

use App\Models\SiteSetting;
use App\Support\MediaUrl;

class SeoSettings
{
    public const KEYS = [
        'seo_site_url',
        'seo_default_title',
        'seo_default_description',
        'seo_default_keywords',
        'seo_title_template',
        'seo_home_title',
        'seo_home_description',
        'seo_home_keywords',
        'seo_og_image',
        'seo_twitter_handle',
        'seo_robots',
        'seo_google_site_verification',
        'seo_bing_site_verification',
    ];

    public static function defaults(): array
    {
        $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        return [
            'seo_site_url' => $frontend,
            'seo_default_title' => 'PixelNoryx | The Developer Dispatch',
            'seo_default_description' => 'A free weekly newsletter on React, Laravel, SaaS, and shipping digital products.',
            'seo_default_keywords' => 'tech magazine, developer blog, newsletter, react, laravel',
            'seo_title_template' => '%s | PixelNoryx',
            'seo_home_title' => 'PixelNoryx | The Developer Dispatch',
            'seo_home_description' => 'A free weekly newsletter on React, Laravel, SaaS, and shipping digital products.',
            'seo_home_keywords' => 'tech magazine, developer blog, newsletter, react, laravel',
            'seo_og_image' => '',
            'seo_twitter_handle' => '',
            'seo_robots' => 'index, follow',
            'seo_google_site_verification' => '',
            'seo_bing_site_verification' => '',
        ];
    }

    public static function all(): array
    {
        $data = [];
        foreach (self::defaults() as $key => $default) {
            $data[$key] = SiteSetting::get($key, $default);
        }

        return $data;
    }

    public static function save(array $data): void
    {
        foreach (self::KEYS as $key) {
            if (array_key_exists($key, $data)) {
                SiteSetting::set($key, $data[$key] ?? '');
            }
        }
    }

    public static function toApiPayload(): array
    {
        $settings = self::all();
        $siteUrl = rtrim((string) $settings['seo_site_url'], '/');
        $ogImage = self::resolveUrl($settings['seo_og_image'] ?? '');

        return [
            'siteUrl' => $siteUrl,
            'defaultTitle' => $settings['seo_default_title'],
            'defaultDescription' => $settings['seo_default_description'],
            'defaultKeywords' => self::keywordsToArray($settings['seo_default_keywords'] ?? ''),
            'titleTemplate' => $settings['seo_title_template'],
            'robots' => $settings['seo_robots'],
            'verification' => [
                'google' => $settings['seo_google_site_verification'] ?: null,
                'bing' => $settings['seo_bing_site_verification'] ?: null,
            ],
            'home' => [
                'title' => $settings['seo_home_title'],
                'description' => $settings['seo_home_description'],
                'keywords' => self::keywordsToArray($settings['seo_home_keywords'] ?? ''),
            ],
            'openGraph' => [
                'siteName' => SiteSetting::get('site_name', 'PixelNoryx'),
                'image' => $ogImage ?: null,
                'twitterHandle' => $settings['seo_twitter_handle'] ?: null,
            ],
        ];
    }

    public static function postSeoPayload($post): array
    {
        $settings = self::all();
        $siteUrl = rtrim((string) $settings['seo_site_url'], '/');
        $title = $post->meta_title ?: $post->title;
        $description = $post->meta_description ?: $post->excerpt;
        $image = self::resolveUrl($post->og_image ?: $post->image);
        $canonical = $post->canonical_url ?: "{$siteUrl}/archive/{$post->slug}";

        return [
            'title' => self::formatTitle($title, $settings['seo_title_template']),
            'description' => $description,
            'keywords' => self::keywordsToArray($post->meta_keywords ?? ''),
            'canonical' => $canonical,
            'robots' => $post->robots ?: $settings['seo_robots'],
            'openGraph' => [
                'title' => $title,
                'description' => $description,
                'image' => $image,
                'url' => $canonical,
                'type' => 'article',
            ],
        ];
    }

    public static function formatTitle(string $title, ?string $template = null): string
    {
        $template = $template ?: '%s | PixelNoryx';

        if (str_contains($template, '%s')) {
            return sprintf($template, $title);
        }

        return $title.' | '.$template;
    }

    public static function resolveUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return MediaUrl::public($path);
    }

    /**
     * @return list<string>
     */
    public static function keywordsToArray(string $keywords): array
    {
        if (blank($keywords)) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $keywords))));
    }
}
