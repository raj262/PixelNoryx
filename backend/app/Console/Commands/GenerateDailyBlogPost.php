<?php

namespace App\Console\Commands;

use App\Services\AutoBlog\DailyPostPipeline;
use Illuminate\Console\Command;

class GenerateDailyBlogPost extends Command
{
    protected $signature = 'blog:generate-daily
                            {--force : Run even if auto-blog is disabled or already ran today}';

    protected $description = 'Generate one SEO blog post from the keyword pool (research → dedupe → write → validate → draft/publish)';

    public function handle(DailyPostPipeline $pipeline): int
    {
        $this->info('Starting daily auto-blog pipeline…');

        $result = $pipeline->run(force: (bool) $this->option('force'));

        if ($result['skipped'] ?? false) {
            $this->warn($result['message']);

            return self::SUCCESS;
        }

        if (! ($result['ok'] ?? false)) {
            $this->error($result['message']);

            return self::FAILURE;
        }

        $post = $result['post'] ?? null;
        if ($post) {
            $this->info("Post #{$post->id}: {$post->title}");
            $this->line("Slug: {$post->slug}");
            $this->line("Status: {$post->status}");
        } else {
            $this->info($result['message']);
        }

        return self::SUCCESS;
    }
}
