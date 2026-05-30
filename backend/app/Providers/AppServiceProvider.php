<?php

namespace App\Providers;

use App\Models\Post;
use App\Observers\PostObserver;
use App\Support\MailSettings;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        MailSettings::apply();
        Post::observe(PostObserver::class);

        RateLimiter::for('ai', function (Request $request) {
            return Limit::perMinute((int) config('ai.rate_limit_per_minute', 20))
                ->by($request->ip());
        });
    }
}
