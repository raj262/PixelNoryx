<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\SubscriberController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);
    Route::get('/categories', [PostController::class, 'categories']);

    Route::get('/settings', [SiteController::class, 'settings']);
    Route::get('/seo', [SiteController::class, 'seo']);
    Route::get('/faqs', [SiteController::class, 'faqs']);
    Route::get('/testimonials', [SiteController::class, 'testimonials']);

    Route::post('/subscribe', [SubscriberController::class, 'store']);
    Route::post('/contact', [ContactController::class, 'store']);

    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
    });
});
