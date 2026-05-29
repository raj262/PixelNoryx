<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(string $slug): JsonResponse
    {
        $post = Post::query()->published()->where('slug', $slug)->firstOrFail();

        $comments = Comment::query()
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
            ->where('is_approved', true)
            ->with([
                'user',
                'replies' => fn ($q) => $q
                    ->where('is_approved', true)
                    ->with('user')
                    ->orderBy('created_at'),
            ])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => CommentResource::collection($comments),
            'meta' => [
                'count' => $post->comment_count,
                'postSlug' => $post->slug,
            ],
        ]);
    }

    public function store(StoreCommentRequest $request, string $slug): JsonResponse
    {
        $post = Post::query()->published()->where('slug', $slug)->firstOrFail();
        $user = $request->user();

        $parentId = $request->validated('parent_id');

        if ($parentId) {
            $parent = Comment::query()
                ->where('post_id', $post->id)
                ->where('id', $parentId)
                ->whereNull('parent_id')
                ->firstOrFail();
            $parentId = $parent->id;
        }

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'parent_id' => $parentId,
            'body' => trim($request->validated('body')),
            'is_approved' => true,
        ]);

        $post->syncCommentCount();

        $comment->load(['user', 'replies.user']);

        return response()->json([
            'data' => new CommentResource($comment),
            'meta' => [
                'count' => $post->fresh()->comment_count,
            ],
        ], 201);
    }

    public function destroy(Request $request, string $slug, Comment $comment): JsonResponse
    {
        $post = Post::query()->published()->where('slug', $slug)->firstOrFail();

        if ($comment->post_id !== $post->id) {
            abort(404);
        }

        if ($comment->user_id !== $request->user()->id) {
            abort(403);
        }

        $comment->delete();
        $post->syncCommentCount();

        return response()->json([
            'message' => 'Comment deleted',
            'meta' => ['count' => $post->fresh()->comment_count],
        ]);
    }
}
