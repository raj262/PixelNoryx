<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KeywordPoolItem extends Model
{
    protected $table = 'keyword_pool';

    protected $fillable = [
        'keyword',
        'category_id',
        'priority',
        'is_active',
        'times_used',
        'last_used_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_used_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function runs(): HasMany
    {
        return $this->hasMany(AutoBlogRun::class, 'keyword_pool_id');
    }

    public function markUsed(): void
    {
        $this->forceFill([
            'times_used' => $this->times_used + 1,
            'last_used_at' => now(),
        ])->save();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeReady($query)
    {
        return $query->active()
            ->orderByRaw("CASE priority WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END")
            ->orderBy('times_used')
            ->orderBy('id');
    }
}
