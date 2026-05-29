<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'parentId' => $this->parent_id,
            'createdAt' => $this->created_at?->toIso8601String(),
            'createdAtHuman' => $this->created_at?->diffForHumans(),
            'author' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name ?? 'Reader',
            ],
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
        ];
    }
}
