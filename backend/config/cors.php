<?php

/**
 * Build allowed CORS origins from env + FRONTEND_URL.
 * Patterns allow localhost dev against production API without listing every port.
 */
$origins = array_values(array_unique(array_filter(array_map(
    static fn (string $o): string => rtrim(trim($o), '/'),
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))
))));

$frontend = rtrim((string) env('FRONTEND_URL', ''), '/');
if ($frontend !== '' && ! in_array($frontend, $origins, true)) {
    $origins[] = $frontend;
}

$defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

foreach ($defaults as $origin) {
    if (! in_array($origin, $origins, true)) {
        $origins[] = $origin;
    }
}

$patterns = array_values(array_filter([
    '#^https?://localhost(:\d+)?$#',
    '#^https?://127\.0\.0\.1(:\d+)?$#',
    env('CORS_ORIGIN_PATTERN_RAJESHCODES') !== '0'
        ? '#^https?://([a-z0-9-]+\.)?rajeshcodes\.in$#i'
        : null,
]));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $origins,

    'allowed_origins_patterns' => $patterns,

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => (int) env('CORS_MAX_AGE', 3600),

    // Bearer tokens in Authorization header — no cookies required for public API
    'supports_credentials' => filter_var(
        env('CORS_SUPPORTS_CREDENTIALS', false),
        FILTER_VALIDATE_BOOLEAN
    ),
];
