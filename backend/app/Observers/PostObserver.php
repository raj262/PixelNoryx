<?php

namespace App\Observers;

use App\Models\Post;
use App\Services\Push\PushNotificationService;

class PostObserver
{
    public function created(Post $post): void
    {
        if ($post->status === 'published' && $post->published_at !== null) {
            $this->notify($post);
        }
    }

    public function updated(Post $post): void
    {
        if (! $post->wasChanged('status') || $post->status !== 'published') {
            return;
        }

        $this->notify($post);
    }

    private function notify(Post $post): void
    {
        if ($post->published_at === null || $post->published_at->isFuture()) {
            return;
        }

        app(PushNotificationService::class)->notifyNewPost($post);
    }
}
