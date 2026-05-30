<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PushController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\SubscriberController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::options('/{any}', fn () => response('', 204))->where('any', '.*');
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);
    Route::get('/posts/{slug}/comments', [CommentController::class, 'index']);
    Route::get('/categories', [PostController::class, 'categories']);

    Route::get('/settings', [SiteController::class, 'settings']);
    Route::get('/bootstrap', [SiteController::class, 'bootstrap']);
    Route::get('/seo', [SiteController::class, 'seo']);
    Route::get('/faqs', [SiteController::class, 'faqs']);
    Route::get('/testimonials', [SiteController::class, 'testimonials']);

    Route::post('/subscribe', [SubscriberController::class, 'store']);
    Route::post('/contact', [ContactController::class, 'store']);

    Route::get('/push/config', [PushController::class, 'config']);
    Route::post('/push/subscribe', [PushController::class, 'subscribe']);
    Route::post('/push/unsubscribe', [PushController::class, 'unsubscribe']);

    Route::get('/ai/status', [AiController::class, 'status']);
    Route::middleware('throttle:ai')->group(function () {
        Route::post('/ai/chat', [AiController::class, 'chat']);
        Route::post('/ai/generate', [AiController::class, 'generate']);
    });

    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/posts/{slug}/comments', [CommentController::class, 'store']);
        Route::delete('/posts/{slug}/comments/{comment}', [CommentController::class, 'destroy']);
    });
});
