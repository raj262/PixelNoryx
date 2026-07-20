<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('keyword_pool')) {
            Schema::create('keyword_pool', function (Blueprint $table) {
                $table->id();
                $table->string('keyword');
                $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
                $table->string('priority')->default('normal'); // high|normal|low
                $table->boolean('is_active')->default(true);
                $table->unsignedInteger('times_used')->default(0);
                $table->timestamp('last_used_at')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->unique('keyword');
                $table->index(['is_active', 'priority', 'times_used']);
            });
        }

        if (! Schema::hasTable('auto_blog_runs')) {
            Schema::create('auto_blog_runs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('keyword_pool_id')->nullable()->constrained('keyword_pool')->nullOnDelete();
                $table->foreignId('post_id')->nullable()->constrained()->nullOnDelete();
                $table->string('status'); // started|researching|generating|validating|saved|failed|skipped
                $table->string('topic')->nullable();
                $table->string('title')->nullable();
                $table->string('slug')->nullable();
                $table->json('research')->nullable();
                $table->json('validation')->nullable();
                $table->text('error')->nullable();
                $table->unsignedInteger('word_count')->nullable();
                $table->boolean('published')->default(false);
                $table->timestamps();

                $table->index(['status', 'created_at']);
            });
        }

        if (Schema::hasTable('posts') && ! Schema::hasColumn('posts', 'faqs')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->json('faqs')->nullable()->after('content');
            });
        }
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('faqs');
        });

        Schema::dropIfExists('auto_blog_runs');
        Schema::dropIfExists('keyword_pool');
    }
};
