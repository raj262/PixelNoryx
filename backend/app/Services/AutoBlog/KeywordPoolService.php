<?php

namespace App\Services\AutoBlog;

use App\Models\KeywordPoolItem;
use App\Support\AutoBlogSettings;
use RuntimeException;

class KeywordPoolService
{
    public function next(): KeywordPoolItem
    {
        $item = KeywordPoolItem::query()->ready()->first();

        if (! $item) {
            throw new RuntimeException(
                'Keyword pool is empty. Add keywords in Admin → Content → Keyword Pool before running auto-blog.'
            );
        }

        $settings = AutoBlogSettings::all();
        if (filled($settings['default_category_id'] ?? null) && ! $item->category_id) {
            $item->category_id = (int) $settings['default_category_id'];
        }

        return $item;
    }
}
