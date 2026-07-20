<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;

class AiSettings
{
    public const KEYS = [
        'ai_enabled',
        'ai_provider',
        'ai_model',
        'ai_max_tokens',
        'ai_temperature',
        'ai_rate_limit',
        'ai_base_url',
        'ai_gemini_base_url',
    ];

    /** @return array<string, mixed> */
    public static function defaults(): array
    {
        $provider = (string) env('AI_PROVIDER', 'openai');

        return [
            'ai_enabled' => filter_var(env('AI_ENABLED', true), FILTER_VALIDATE_BOOLEAN) ? '1' : '0',
            'ai_provider' => $provider,
            'ai_model' => (string) env(
                'AI_MODEL',
                in_array($provider, ['gemini', 'google'], true) ? 'gemini-2.0-flash' : 'gpt-4o-mini'
            ),
            'ai_max_tokens' => (string) env('AI_MAX_TOKENS', '4096'),
            'ai_temperature' => (string) env('AI_TEMPERATURE', '0.7'),
            'ai_rate_limit' => (string) env('AI_RATE_LIMIT', '20'),
            'ai_base_url' => rtrim((string) env('AI_BASE_URL', 'https://api.openai.com/v1'), '/'),
            'ai_gemini_base_url' => rtrim(
                (string) env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
                '/'
            ),
        ];
    }

    /** @return array<string, mixed> */
    public static function all(): array
    {
        $data = [];
        foreach (self::defaults() as $key => $default) {
            $data[$key] = SiteSetting::get($key, $default);
        }

        $data['ai_enabled'] = $data['ai_enabled'] === '1' || $data['ai_enabled'] === true;
        $data['ai_max_tokens'] = (int) $data['ai_max_tokens'];
        $data['ai_temperature'] = (float) $data['ai_temperature'];
        $data['ai_rate_limit'] = (int) $data['ai_rate_limit'];
        $data['openai_api_key_set'] = filled(SiteSetting::get('openai_api_key'));
        $data['gemini_api_key_set'] = filled(SiteSetting::get('gemini_api_key'));

        return $data;
    }

    /** @param  array<string, mixed>  $data */
    public static function save(array $data): void
    {
        foreach (self::KEYS as $key) {
            if (! array_key_exists($key, $data)) {
                continue;
            }

            $value = $data[$key];

            if ($key === 'ai_enabled') {
                SiteSetting::set($key, filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0');

                continue;
            }

            SiteSetting::set($key, is_scalar($value) ? (string) $value : '');
        }

        if (! empty($data['openai_api_key'])) {
            SiteSetting::set('openai_api_key', Crypt::encryptString((string) $data['openai_api_key']));
        }

        if (! empty($data['gemini_api_key'])) {
            SiteSetting::set('gemini_api_key', Crypt::encryptString((string) $data['gemini_api_key']));
        }

        self::apply();
    }

    public static function openaiApiKey(): ?string
    {
        return self::decryptKey('openai_api_key') ?? (filled(env('OPENAI_API_KEY')) ? (string) env('OPENAI_API_KEY') : null);
    }

    public static function geminiApiKey(): ?string
    {
        return self::decryptKey('gemini_api_key') ?? (filled(env('GEMINI_API_KEY')) ? (string) env('GEMINI_API_KEY') : null);
    }

    public static function activeApiKey(): ?string
    {
        $provider = (string) (self::all()['ai_provider'] ?? 'openai');

        if (in_array($provider, ['gemini', 'google'], true)) {
            return self::geminiApiKey();
        }

        return self::openaiApiKey();
    }

    public static function isConfigured(): bool
    {
        try {
            $s = self::all();

            return ($s['ai_enabled'] ?? false) && filled(self::activeApiKey());
        } catch (\Throwable) {
            return false;
        }
    }

    public static function apply(): void
    {
        try {
            $s = self::all();
        } catch (\Throwable) {
            return;
        }

        $provider = (string) ($s['ai_provider'] ?? 'openai');
        $usesGemini = in_array($provider, ['gemini', 'google'], true);

        Config::set('ai.enabled', (bool) ($s['ai_enabled'] ?? false));
        Config::set('ai.provider', $provider);
        Config::set('ai.model', (string) ($s['ai_model'] ?? ($usesGemini ? 'gemini-2.0-flash' : 'gpt-4o-mini')));
        Config::set('ai.max_tokens', (int) ($s['ai_max_tokens'] ?? 4096));
        Config::set('ai.temperature', (float) ($s['ai_temperature'] ?? 0.7));
        Config::set('ai.rate_limit_per_minute', (int) ($s['ai_rate_limit'] ?? 20));
        Config::set('ai.base_url', rtrim((string) ($s['ai_base_url'] ?? 'https://api.openai.com/v1'), '/'));
        Config::set('ai.gemini_base_url', rtrim((string) ($s['ai_gemini_base_url'] ?? 'https://generativelanguage.googleapis.com/v1beta'), '/'));
        Config::set('ai.api_key', self::activeApiKey());
    }

    protected static function decryptKey(string $key): ?string
    {
        $encrypted = SiteSetting::get($key);

        if (! $encrypted) {
            return null;
        }

        try {
            return Crypt::decryptString((string) $encrypted);
        } catch (\Throwable) {
            // Legacy plain-text values (if any)
            return (string) $encrypted;
        }
    }
}
