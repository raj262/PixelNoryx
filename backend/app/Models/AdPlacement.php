<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AdPlacement extends Model
{
    protected $fillable = [
        'placement_key',
        'size',
        'title',
        'subtitle',
        'cta',
        'href',
        'sponsor',
        'gradient_key',
        'is_active',
        'starts_at',
        'ends_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function scopeVisibleNow(Builder $query): Builder
    {
        $today = now()->startOfDay();

        return $query
            ->where('is_active', true)
            ->where(function (Builder $q) use ($today) {
                $q->whereNull('starts_at')
                    ->orWhereDate('starts_at', '<=', $today);
            })
            ->where(function (Builder $q) use ($today) {
                $q->whereNull('ends_at')
                    ->orWhereDate('ends_at', '>=', $today);
            });
    }

    public function isVisibleNow(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $today = now()->startOfDay();

        if ($this->starts_at && $this->starts_at->startOfDay()->gt($today)) {
            return false;
        }

        if ($this->ends_at && $this->ends_at->startOfDay()->lt($today)) {
            return false;
        }

        return true;
    }

    public function scheduleStatus(): string
    {
        if (! $this->is_active) {
            return 'inactive';
        }

        $today = now()->startOfDay();

        if ($this->starts_at && $this->starts_at->startOfDay()->gt($today)) {
            return 'scheduled';
        }

        if ($this->ends_at && $this->ends_at->startOfDay()->lt($today)) {
            return 'expired';
        }

        return 'live';
    }
}
