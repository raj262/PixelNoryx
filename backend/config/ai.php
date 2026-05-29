<?php

$provider = env('AI_PROVIDER', 'gemini');

return [
    'enabled' => env('AI_ENABLED', true),

    'provider' => $provider,

    'api_key' => in_array($provider, ['gemini', 'google'], true)
        ? env('GEMINI_API_KEY')
        : env('OPENAI_API_KEY'),

    'base_url' => rtrim(env('AI_BASE_URL', 'https://api.openai.com/v1'), '/'),

    'gemini_base_url' => rtrim(
        env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
        '/'
    ),

    'model' => env('AI_MODEL', in_array($provider, ['gemini', 'google'], true)
        ? 'gemini-2.0-flash'
        : 'gpt-4o-mini'),

    'max_tokens' => (int) env('AI_MAX_TOKENS', 2000),

    'temperature' => (float) env('AI_TEMPERATURE', 0.7),

    'rate_limit_per_minute' => (int) env('AI_RATE_LIMIT', 20),

    'chat_system_prompt' => env('AI_CHAT_PROMPT', null),
];
