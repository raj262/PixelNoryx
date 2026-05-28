<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Post::query()
            ->published()
            ->with(['category', 'author', 'tags']);

        if ($request->filled('topic')) {
            $query->whereHas('category', fn ($q) => $q->where('name', $request->topic));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query
            ->orderByDesc('published_at')
            ->paginate($request->integer('per_page', 12));

        return PostResource::collection($posts);
    }

    public function show(string $slug): PostResource
    {
        $post = Post::query()
            ->published()
            ->with(['category', 'author', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();

        $post->increment('views');

        return new PostResource($post);
    }

    public function categories(): \Illuminate\Http\JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        return response()->json(['data' => $categories]);
    }
}
