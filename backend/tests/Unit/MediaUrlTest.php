<?php

namespace Tests\Unit;

use App\Support\MediaUrl;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class MediaUrlTest extends TestCase
{
    public function test_rewrites_localhost_url_to_app_url(): void
    {
        Config::set('app.url', 'https://admin.rajeshcodes.in');

        $result = MediaUrl::rewriteLocalHost(
            'http://127.0.0.1:8001/storage/posts/test.png'
        );

        $this->assertSame(
            'https://admin.rajeshcodes.in/storage/posts/test.png',
            $result
        );
    }

    public function test_leaves_production_url_unchanged(): void
    {
        $url = 'https://images.unsplash.com/photo-123?w=800';

        $this->assertSame($url, MediaUrl::rewriteLocalHost($url));
    }
}
