<?php

namespace App\Console\Commands;

use App\Services\Push\PushNotificationService;
use Illuminate\Console\Command;

class SendTestPush extends Command
{
    protected $signature = 'push:test {title=PixelNoryx test} {body=Push notifications are working!}';

    protected $description = 'Send a test web push to all subscribers';

    public function handle(PushNotificationService $push): int
    {
        if (! $push->isConfigured()) {
            $this->error('VAPID keys missing. Run: php artisan push:vapid-keys');

            return self::FAILURE;
        }

        $sent = $push->sendToAll(
            $this->argument('title'),
            $this->argument('body'),
            rtrim((string) env('FRONTEND_URL', 'https://www.pixelnoryx.com'), '/')
        );

        $this->info("Sent to {$sent} subscriber(s).");

        return self::SUCCESS;
    }
}
