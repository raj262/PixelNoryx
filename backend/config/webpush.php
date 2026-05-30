<?php

return [
    'vapid' => [
        'subject' => env('VAPID_SUBJECT', 'mailto:hello@pixelnoryx.com'),
        'public_key' => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
    ],

    'enabled' => filled(env('VAPID_PUBLIC_KEY')) && filled(env('VAPID_PRIVATE_KEY')),
];
