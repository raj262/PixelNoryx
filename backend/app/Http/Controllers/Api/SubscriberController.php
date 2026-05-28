<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Services\MailNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $subscriber = Subscriber::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'] ?? null,
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
                'source' => 'website',
            ]
        );

        if ($subscriber->wasRecentlyCreated) {
            MailNotificationService::subscriberCreated($subscriber);
        }

        return response()->json([
            'message' => 'Successfully subscribed!',
            'data' => ['email' => $subscriber->email],
        ], 201);
    }
}
