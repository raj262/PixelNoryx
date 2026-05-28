<?php

namespace App\Services;

use App\Mail\ContactMessageMail;
use App\Mail\SubscriberAdminNotifyMail;
use App\Mail\SubscriberWelcomeMail;
use App\Models\ContactMessage;
use App\Models\Subscriber;
use App\Support\MailSettings;
use Illuminate\Support\Facades\Log;

class MailNotificationService
{
    public static function contactSubmitted(ContactMessage $message): void
    {
        $settings = MailSettings::all();

        if (! $settings['mail_enabled'] || ! $settings['mail_notify_contact']) {
            return;
        }

        try {
            MailSettings::sendIfConfigured(
                fn () => new ContactMessageMail($message),
                MailSettings::adminTo()
            );
        } catch (\Throwable $e) {
            Log::warning('Contact notification email failed: '.$e->getMessage());
        }
    }

    public static function subscriberCreated(Subscriber $subscriber): void
    {
        $settings = MailSettings::all();

        if (! $settings['mail_enabled']) {
            return;
        }

        try {
            if ($settings['mail_notify_subscribe_welcome']) {
                MailSettings::sendIfConfigured(
                    fn () => new SubscriberWelcomeMail($subscriber),
                    $subscriber->email
                );
            }

            if ($settings['mail_notify_subscribe_admin']) {
                MailSettings::sendIfConfigured(
                    fn () => new SubscriberAdminNotifyMail($subscriber),
                    MailSettings::adminTo()
                );
            }
        } catch (\Throwable $e) {
            Log::warning('Subscriber email failed: '.$e->getMessage());
        }
    }
}
