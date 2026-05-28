<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Support\SeoSettings;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    public function settings(): JsonResponse
    {
        return response()->json([
            'data' => [
                'name' => SiteSetting::get('site_name', 'PixelNoryx'),
                'tagline' => SiteSetting::get('tagline', 'The Developer Dispatch'),
                'description' => SiteSetting::get('description', ''),
                'subscriberCount' => SiteSetting::get('subscriber_count', '0'),
                'frequency' => SiteSetting::get('frequency', 'Every Tuesday'),
            ],
        ]);
    }

    public function seo(): JsonResponse
    {
        return response()->json([
            'data' => SeoSettings::toApiPayload(),
        ]);
    }

    public function faqs(): JsonResponse
    {
        $faqs = Faq::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['question', 'answer']);

        return response()->json(['data' => $faqs]);
    }

    public function testimonials(): JsonResponse
    {
        $items = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $items->map(fn ($t) => [
                'name' => $t->name,
                'role' => $t->role,
                'content' => $t->content,
                'image' => $t->image,
                'avatar' => strtoupper(substr($t->name, 0, 1).substr(strstr($t->name, ' ') ?: '', 1, 1)),
                'rating' => $t->rating,
            ]),
        ]);
    }
}
