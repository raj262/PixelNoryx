<?php

return [
    /*
    |--------------------------------------------------------------------------
    | GA4 Property ID (numeric — NOT the G- measurement ID)
    |--------------------------------------------------------------------------
    | Admin → GA4 → Admin → Property Settings → Property ID
    | Example: 123456789 → API uses properties/123456789
    */
    'property_id' => env('GA4_PROPERTY_ID'),

    /*
    | Measurement ID from the frontend tag (for reference / links only)
    */
    'measurement_id' => env('GA4_MEASUREMENT_ID', 'G-15PBQ74TNC'),

    /*
    | Service account JSON from Google Cloud (Analytics Data API enabled).
    | Grant the service account email "Viewer" on the GA4 property.
    */
    'credentials' => env(
        'GOOGLE_APPLICATION_CREDENTIALS',
        storage_path('app/analytics/service-account.json')
    ),

    'cache_ttl' => (int) env('GA4_CACHE_TTL', 900),
];
