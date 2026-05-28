<?php

return [
    'enabled' => env('AI_ENABLED', true),

    'provider' => env('AI_PROVIDER', 'openai'),

    'api_key' => env('OPENAI_API_KEY'),

    'base_url' => rtrim(env('AI_BASE_URL', 'https://api.openai.com/v1'), '/'),

    'model' => env('AI_MODEL', 'gpt-4o-mini'),

    'max_tokens' => (int) env('AI_MAX_TOKENS', 2000),

    'temperature' => (float) env('AI_TEMPERATURE', 0.7),

    'rate_limit_per_minute' => (int) env('AI_RATE_LIMIT', 20),

    'chat_system_prompt' => env('AI_CHAT_PROMPT', null),
];
