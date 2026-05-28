<?php

namespace App\Http\Resources;

use App\Support\SeoSettings;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = $this->image;
        if ($image && ! str_starts_with($image, 'http')) {
            $image = Storage::disk('public')->url($image);
        }

        return [
            'id' => $this->id,
            'issueNumber' => $this->issue_number,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'preview' => $this->preview,
            'content' => $this->content,
            'image' => $image,
            'topic' => $this->category?->name,
            'category' => $this->category?->name,
            'author' => $this->author?->name ?? 'PixelNoryx',
            'authorRole' => 'Editor',
            'date' => $this->published_at?->format('M j, Y') ?? $this->created_at->format('M j, Y'),
            'readTime' => $this->read_time,
            'tags' => $this->tags->pluck('name'),
            'featured' => $this->is_featured,
            'free' => $this->is_free,
            'sponsored' => $this->is_sponsored,
            'commentCount' => $this->comment_count,
            'seo' => SeoSettings::postSeoPayload($this->resource),
        ];
    }
}
