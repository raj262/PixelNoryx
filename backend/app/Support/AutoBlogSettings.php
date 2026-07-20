<?php

namespace App\Support;

use App\Models\SiteSetting;
use App\Models\User;

class AutoBlogSettings
{
    public const KEY = 'auto_blog';

    /** @return array<string, mixed> */
    public static function defaults(): array
    {
        return [
            'enabled' => false,
            'run_at' => '08:00',
            'timezone' => 'Asia/Kolkata',
            'default_status' => 'draft', // draft|published — never give AI full auto-publish by default
            'min_words' => 1200,
            'max_words' => 2200,
            'author_user_id' => null,
            'default_category_id' => null,
            'skip_if_post_today' => true,
            'similarity_threshold' => 0.72,
        ];
    }

    /** @return array<string, mixed> */
    public static function all(): array
    {
        return array_merge(self::defaults(), SiteSetting::getJson(self::KEY, []));
    }

    /** @param  array<string, mixed>  $data */
    public static function save(array $data): void
    {
        $defaults = self::defaults();

        SiteSetting::setJson(self::KEY, [
            'enabled' => filter_var($data['enabled'] ?? $defaults['enabled'], FILTER_VALIDATE_BOOLEAN),
            'run_at' => (string) ($data['run_at'] ?? $defaults['run_at']),
            'timezone' => (string) ($data['timezone'] ?? $defaults['timezone']),
            'default_status' => in_array($data['default_status'] ?? '', ['draft', 'published'], true)
                ? $data['default_status']
                : 'draft',
            'min_words' => max(400, (int) ($data['min_words'] ?? $defaults['min_words'])),
            'max_words' => max(800, (int) ($data['max_words'] ?? $defaults['max_words'])),
            'author_user_id' => filled($data['author_user_id'] ?? null) ? (int) $data['author_user_id'] : null,
            'default_category_id' => filled($data['default_category_id'] ?? null) ? (int) $data['default_category_id'] : null,
            'skip_if_post_today' => filter_var($data['skip_if_post_today'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'similarity_threshold' => min(0.95, max(0.5, (float) ($data['similarity_threshold'] ?? $defaults['similarity_threshold']))),
        ]);
    }

    public static function resolveAuthorId(): ?int
    {
        $settings = self::all();

        if (filled($settings['author_user_id'] ?? null)) {
            return (int) $settings['author_user_id'];
        }

        return User::query()->orderBy('id')->value('id');
    }
}
