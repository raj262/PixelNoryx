<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $fillable = [
        'category_id',
        'user_id',
        'issue_number',
        'slug',
        'title',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'excerpt',
        'preview',
        'content',
        'image',
        'og_image',
        'canonical_url',
        'robots',
        'read_time',
        'is_featured',
        'is_free',
        'is_sponsored',
        'status',
        'published_at',
        'comment_count',
        'views',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_free' => 'boolean',
            'is_sponsored' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Post $post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
