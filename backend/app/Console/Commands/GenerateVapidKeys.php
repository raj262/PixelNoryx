<?php

namespace App\Console\Commands;

use App\Services\Push\PushNotificationService;
use Illuminate\Console\Command;

class GenerateVapidKeys extends Command
{
    protected $signature = 'push:vapid-keys';

    protected $description = 'Generate VAPID keys for web push notifications';

    public function handle(): int
    {
        if (! class_exists(\Minishlink\WebPush\VAPID::class)) {
            $this->error('Run: composer require minishlink/web-push');

            return self::FAILURE;
        }

        $keys = \Minishlink\WebPush\VAPID::createVapidKeys();

        $this->newLine();
        $this->info('Add these to backend/.env:');
        $this->newLine();
        $this->line('VAPID_PUBLIC_KEY='.$keys['publicKey']);
        $this->line('VAPID_PRIVATE_KEY='.$keys['privateKey']);
        $this->line('VAPID_SUBJECT=mailto:hello@pixelnoryx.com');
        $this->newLine();
        $this->info('Add to frontend .env (Vercel):');
        $this->line('NEXT_PUBLIC_VAPID_PUBLIC_KEY='.$keys['publicKey']);
        $this->newLine();

        return self::SUCCESS;
    }
}
