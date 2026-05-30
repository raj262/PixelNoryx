<?php

namespace App\Services\Push;

use App\Models\Post;
use App\Models\PushSubscription;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushNotificationService
{
    public function isConfigured(): bool
    {
        return (bool) config('webpush.enabled');
    }

    public function publicKey(): ?string
    {
        $key = config('webpush.vapid.public_key');

        return is_string($key) && $key !== '' ? $key : null;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function sendToAll(string $title, string $body, ?string $url = null, array $payload = []): int
    {
        if (! $this->isConfigured()) {
            return 0;
        }

        $message = json_encode([
            'title' => $title,
            'body' => $body,
            'url' => $url ?? '/',
            ...$payload,
        ], JSON_THROW_ON_ERROR);

        $webPush = $this->client();
        $sent = 0;

        foreach (PushSubscription::query()->cursor() as $record) {
            try {
                $result = $webPush->sendOneNotification(
                    Subscription::create([
                        'endpoint' => $record->endpoint,
                        'publicKey' => $record->public_key,
                        'authToken' => $record->auth_token,
                        'contentEncoding' => $record->content_encoding,
                    ]),
                    $message
                );

                if ($result->isSuccess()) {
                    $sent++;

                    continue;
                }

                if ($result->isSubscriptionExpired()) {
                    $record->delete();
                }
            } catch (\Throwable $e) {
                Log::warning('Push notification failed: '.$e->getMessage(), [
                    'endpoint' => $record->endpoint,
                ]);
            }
        }

        return $sent;
    }

    public function notifyNewPost(Post $post): int
    {
        $frontend = rtrim((string) env('FRONTEND_URL', 'https://www.pixelnoryx.com'), '/');
        $url = $frontend.'/archive/'.$post->slug;

        return $this->sendToAll(
            'New on PixelNoryx',
            $post->title,
            $url,
            ['tag' => 'post-'.$post->slug]
        );
    }

    private function client(): WebPush
    {
        return new WebPush([
            'VAPID' => [
                'subject' => config('webpush.vapid.subject'),
                'publicKey' => config('webpush.vapid.public_key'),
                'privateKey' => config('webpush.vapid.private_key'),
            ],
        ]);
    }
}
