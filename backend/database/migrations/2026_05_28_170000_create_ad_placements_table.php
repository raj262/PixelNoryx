<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_placements', function (Blueprint $table) {
            $table->id();
            $table->string('placement_key')->unique();
            $table->string('size')->default('leaderboard');
            $table->string('title');
            $table->text('subtitle')->nullable();
            $table->string('cta')->nullable();
            $table->string('href')->nullable();
            $table->string('sponsor')->nullable();
            $table->string('gradient_key')->default('brand');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_placements');
    }
};
