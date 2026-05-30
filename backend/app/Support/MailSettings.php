<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;

class MailSettings
{
    public const KEYS = [
        'mail_enabled',
        'mail_host',
        'mail_port',
        'mail_encryption',
        'mail_username',
        'mail_from_address',
        'mail_from_name',
        'mail_admin_to',
        'mail_notify_contact',
        'mail_notify_subscribe_admin',
        'mail_notify_subscribe_welcome',
    ];

    public static function defaults(): array
    {
        return [
            'mail_enabled' => '0',
            'mail_host' => 'smtp.gmail.com',
            'mail_port' => '587',
            'mail_encryption' => 'tls',
            'mail_username' => '',
            'mail_from_address' => '',
            'mail_from_name' => 'PixelNoryx',
            'mail_admin_to' => '',
            'mail_notify_contact' => '1',
            'mail_notify_subscribe_admin' => '1',
            'mail_notify_subscribe_welcome' => '1',
        ];
    }

    public static function all(): array
    {
        $data = [];
        foreach (self::defaults() as $key => $default) {
            $data[$key] = SiteSetting::get($key, $default);
        }

        $data['mail_enabled'] = $data['mail_enabled'] === '1';
        $data['mail_notify_contact'] = $data['mail_notify_contact'] === '1';
        $data['mail_notify_subscribe_admin'] = $data['mail_notify_subscribe_admin'] === '1';
        $data['mail_notify_subscribe_welcome'] = $data['mail_notify_subscribe_welcome'] === '1';
        $data['mail_port'] = (int) $data['mail_port'];
        $data['mail_password_set'] = filled(SiteSetting::get('mail_password'));

        return $data;
    }

    public static function save(array $data): void
    {
        $boolKeys = [
            'mail_enabled',
            'mail_notify_contact',
            'mail_notify_subscribe_admin',
            'mail_notify_subscribe_welcome',
        ];

        foreach (self::KEYS as $key) {
            if (! array_key_exists($key, $data)) {
                continue;
            }

            $value = $data[$key];

            if (in_array($key, $boolKeys, true)) {
                SiteSetting::set($key, filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0');

                continue;
            }

            SiteSetting::set($key, is_scalar($value) ? (string) $value : '');
        }

        if (! empty($data['mail_password'])) {
            SiteSetting::set('mail_password', Crypt::encryptString((string) $data['mail_password']));
        }
    }

    public static function password(): ?string
    {
        $encrypted = SiteSetting::get('mail_password');

        if (! $encrypted) {
            return null;
        }

        try {
            return Crypt::decryptString((string) $encrypted);
        } catch (\Throwable) {
            return null;
        }
    }

    public static function isConfigured(): bool
    {
        $s = self::all();

        return $s['mail_enabled']
            && filled($s['mail_host'])
            && filled($s['mail_username'])
            && filled(self::password());
    }

    public static function apply(): void
    {
        try {
            if (! self::isConfigured()) {
                return;
            }
        } catch (\Throwable) {
            return;
        }

        $settings = self::all();
        $encryption = (string) SiteSetting::get('mail_encryption', 'tls');

        Config::set('mail.default', 'smtp');
        Config::set('mail.mailers.smtp.host', $settings['mail_host']);
        Config::set('mail.mailers.smtp.port', $settings['mail_port']);
        Config::set('mail.mailers.smtp.username', $settings['mail_username']);
        Config::set('mail.mailers.smtp.password', self::password());
        Config::set('mail.mailers.smtp.scheme', $encryption === 'ssl' ? 'smtps' : null);
        Config::set('mail.mailers.smtp.encryption', $encryption === 'none' ? null : $encryption);

        Config::set('mail.from.address', $settings['mail_from_address'] ?: $settings['mail_username']);
        Config::set('mail.from.name', $settings['mail_from_name'] ?: 'PixelNoryx');
    }

    public static function adminTo(): string
    {
        $to = (string) SiteSetting::get('mail_admin_to', '');

        if (filled($to)) {
            return $to;
        }

        return (string) SiteSetting::get('contact_email', SiteContent::defaults()['contact_email']);
    }

    /**
     * @param  callable(): \Illuminate\Mail\Mailable  $mailableFactory
     */
    public static function sendIfConfigured(callable $mailableFactory, string $to): bool
    {
        if (! self::isConfigured() || ! filled($to)) {
            return false;
        }

        self::apply();

        Mail::to($to)->send($mailableFactory());

        return true;
    }
}
