<?php

use App\Support\AutoBlogSettings;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('blog:generate-daily')
    ->dailyAt(AutoBlogSettings::all()['run_at'] ?? '08:00')
    ->timezone(AutoBlogSettings::all()['timezone'] ?? 'Asia/Kolkata')
    ->withoutOverlapping()
    ->when(fn () => (bool) (AutoBlogSettings::all()['enabled'] ?? false));
