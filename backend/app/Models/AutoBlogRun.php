<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoBlogRun extends Model
{
    protected $fillable = [
        'keyword_pool_id',
        'post_id',
        'status',
        'topic',
        'title',
        'slug',
        'research',
        'validation',
        'error',
        'word_count',
        'published',
    ];

    protected function casts(): array
    {
        return [
            'research' => 'array',
            'validation' => 'array',
            'published' => 'boolean',
        ];
    }

    public function keyword(): BelongsTo
    {
        return $this->belongsTo(KeywordPoolItem::class, 'keyword_pool_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
