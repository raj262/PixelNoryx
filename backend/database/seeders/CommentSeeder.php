<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $post = Post::query()->where('slug', 'multi-vendor-marketplace-playbook')->first();
        $user = User::query()->where('email', 'user@pixelnoryx.demo')->first();

        if (! $post || ! $user) {
            return;
        }

        if ($post->comments()->exists()) {
            $post->syncCommentCount();

            return;
        }

        $top = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'body' => 'The commission split section alone was worth the read. Are you planning a follow-up on payout webhooks?',
            'is_approved' => true,
        ]);

        Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'parent_id' => $top->id,
            'body' => 'Would love that — especially Stripe Connect vs manual settlement.',
            'is_approved' => true,
        ]);

        $post->syncCommentCount();
    }
}
