<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use App\Services\Push\PushNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushController extends Controller
{
    public function config(PushNotificationService $push): JsonResponse
    {
        return response()->json([
            'data' => [
                'enabled' => $push->isConfigured(),
                'publicKey' => $push->publicKey(),
            ],
        ]);
    }

    public function subscribe(Request $request): JsonResponse
    {
        if (! app(PushNotificationService::class)->isConfigured()) {
            return response()->json([
                'message' => 'Push notifications are not configured on the server.',
            ], 503);
        }

        $validated = $request->validate([
            'endpoint' => ['required', 'url', 'max:2048'],
            'keys' => ['required', 'array'],
            'keys.p256dh' => ['required', 'string'],
            'keys.auth' => ['required', 'string'],
            'contentEncoding' => ['nullable', 'string', 'max:32'],
        ]);

        $userId = $request->user()?->id;

        PushSubscription::query()->updateOrCreate(
            ['endpoint' => $validated['endpoint']],
            [
                'public_key' => $validated['keys']['p256dh'],
                'auth_token' => $validated['keys']['auth'],
                'content_encoding' => $validated['contentEncoding'] ?? null,
                'user_id' => $userId,
                'user_agent' => $request->userAgent(),
            ]
        );

        return response()->json([
            'message' => 'Push notifications enabled.',
        ], 201);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'endpoint' => ['required', 'url', 'max:2048'],
        ]);

        PushSubscription::query()
            ->where('endpoint', $validated['endpoint'])
            ->delete();

        return response()->json([
            'message' => 'Push notifications disabled.',
        ]);
    }
}
