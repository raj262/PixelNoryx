<?php

namespace App\Support;

use App\Models\SiteSetting;

class LegalPages
{
    public const PRIVACY = 'privacy-policy';

    public const DISCLAIMER = 'disclaimer';

    public const TERMS = 'terms-and-conditions';

    /** @return list<string> */
    public static function slugs(): array
    {
        return [self::PRIVACY, self::DISCLAIMER, self::TERMS];
    }

    /** @return array<string, array{title: string, path: string, metaDescription: string, content: string, isPublished: bool}> */
    public static function defaults(): array
    {
        return [
            self::PRIVACY => [
                'title' => 'Privacy Policy',
                'path' => '/privacy-policy',
                'metaDescription' => 'How PixelNoryx collects, uses, and protects your personal information.',
                'content' => <<<'HTML'
<p>Last updated: June 1, 2026</p>
<p>PixelNoryx ("we", "us", "our") respects your privacy. This policy explains what information we collect when you visit our website or subscribe to our newsletter, and how we use it.</p>
<h2>Information we collect</h2>
<p>We may collect your name, email address, and basic usage data such as pages visited and referral source when you use our site or subscribe.</p>
<h2>How we use information</h2>
<p>We use your information to deliver the newsletter, improve our content, respond to contact requests, and send important service updates. We do not sell your email address to third parties.</p>
<h2>Cookies and analytics</h2>
<p>We may use cookies and analytics tools (such as Google Analytics) to understand traffic and improve the site. You can control cookies through your browser settings.</p>
<h2>Data retention</h2>
<p>We retain subscriber data while you remain subscribed. You may unsubscribe at any time using the link in any email.</p>
<h2>Contact</h2>
<p>Questions about this policy? Email hello@pixelnoryx.com.</p>
HTML,
                'isPublished' => true,
            ],
            self::DISCLAIMER => [
                'title' => 'Disclaimer',
                'path' => '/disclaimer',
                'metaDescription' => 'Disclaimer for PixelNoryx content, tutorials, and newsletter materials.',
                'content' => <<<'HTML'
<p>Last updated: June 1, 2026</p>
<p>The information on PixelNoryx is provided for general educational and informational purposes only. While we strive for accuracy, we make no guarantees that content is complete, current, or error-free.</p>
<h2>Not professional advice</h2>
<p>Articles, code samples, and newsletter issues do not constitute legal, financial, or professional advice. Always verify information and consult qualified professionals before making business or technical decisions.</p>
<h2>External links</h2>
<p>Our site may link to third-party websites. We are not responsible for the content, policies, or practices of external sites.</p>
<h2>Limitation of liability</h2>
<p>PixelNoryx and its contributors are not liable for any loss or damage arising from the use of our website, newsletter, or related materials.</p>
<h2>Contact</h2>
<p>If you have questions about this disclaimer, contact hello@pixelnoryx.com.</p>
HTML,
                'isPublished' => true,
            ],
            self::TERMS => [
                'title' => 'Terms and Conditions',
                'path' => '/terms-and-conditions',
                'metaDescription' => 'Terms and conditions for using PixelNoryx and subscribing to our newsletter.',
                'content' => <<<'HTML'
<p>Last updated: June 1, 2026</p>
<p>By accessing PixelNoryx or subscribing to our newsletter, you agree to these Terms and Conditions.</p>
<h2>Use of the website</h2>
<p>You agree to use this website lawfully and not to attempt to disrupt, scrape, or misuse our services.</p>
<h2>Newsletter subscription</h2>
<p>When you subscribe, you confirm that you provided a valid email address and consent to receive emails from PixelNoryx. You may unsubscribe at any time.</p>
<h2>Intellectual property</h2>
<p>All content on PixelNoryx — including text, branding, and layout — is owned by PixelNoryx or its licensors unless otherwise stated. You may not republish our content without permission.</p>
<h2>Changes</h2>
<p>We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.</p>
<h2>Contact</h2>
<p>For questions about these terms, email hello@pixelnoryx.com.</p>
HTML,
                'isPublished' => true,
            ],
        ];
    }

    /** @return array<string, array{title: string, path: string, metaDescription: string, content: string, isPublished: bool}> */
    public static function all(): array
    {
        $stored = SiteSetting::getJson('legal_pages', []);
        $defaults = self::defaults();
        $merged = [];

        foreach (self::slugs() as $slug) {
            $default = $defaults[$slug];
            $page = is_array($stored[$slug] ?? null) ? $stored[$slug] : [];

            $merged[$slug] = [
                'title' => filled($page['title'] ?? null) ? (string) $page['title'] : $default['title'],
                'path' => $default['path'],
                'metaDescription' => filled($page['metaDescription'] ?? null)
                    ? (string) $page['metaDescription']
                    : $default['metaDescription'],
                'content' => filled($page['content'] ?? null) ? (string) $page['content'] : $default['content'],
                'isPublished' => array_key_exists('isPublished', $page)
                    ? filter_var($page['isPublished'], FILTER_VALIDATE_BOOLEAN)
                    : $default['isPublished'],
            ];
        }

        return $merged;
    }

    /** @return array{slug: string, title: string, path: string, metaDescription: string, content: string, isPublished: bool}|null */
    public static function find(string $slug): ?array
    {
        if (! in_array($slug, self::slugs(), true)) {
            return null;
        }

        $page = self::all()[$slug];

        return [
            'slug' => $slug,
            ...$page,
        ];
    }

    /** @return list<array{slug: string, title: string, path: string}> */
    public static function publishedIndex(): array
    {
        $out = [];

        foreach (self::all() as $slug => $page) {
            if (! $page['isPublished']) {
                continue;
            }

            $out[] = [
                'slug' => $slug,
                'title' => $page['title'],
                'path' => $page['path'],
            ];
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function adminFormData(): array
    {
        $pages = self::all();

        return [
            'privacy_policy_title' => $pages[self::PRIVACY]['title'],
            'privacy_policy_meta_description' => $pages[self::PRIVACY]['metaDescription'],
            'privacy_policy_content' => $pages[self::PRIVACY]['content'],
            'privacy_policy_is_published' => $pages[self::PRIVACY]['isPublished'],
            'disclaimer_title' => $pages[self::DISCLAIMER]['title'],
            'disclaimer_meta_description' => $pages[self::DISCLAIMER]['metaDescription'],
            'disclaimer_content' => $pages[self::DISCLAIMER]['content'],
            'disclaimer_is_published' => $pages[self::DISCLAIMER]['isPublished'],
            'terms_title' => $pages[self::TERMS]['title'],
            'terms_meta_description' => $pages[self::TERMS]['metaDescription'],
            'terms_content' => $pages[self::TERMS]['content'],
            'terms_is_published' => $pages[self::TERMS]['isPublished'],
        ];
    }

    /** @param  array<string, mixed>  $data */
    public static function saveFromAdminForm(array $data): void
    {
        $payload = [
            self::PRIVACY => [
                'title' => (string) ($data['privacy_policy_title'] ?? 'Privacy Policy'),
                'metaDescription' => (string) ($data['privacy_policy_meta_description'] ?? ''),
                'content' => (string) ($data['privacy_policy_content'] ?? ''),
                'isPublished' => filter_var($data['privacy_policy_is_published'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ],
            self::DISCLAIMER => [
                'title' => (string) ($data['disclaimer_title'] ?? 'Disclaimer'),
                'metaDescription' => (string) ($data['disclaimer_meta_description'] ?? ''),
                'content' => (string) ($data['disclaimer_content'] ?? ''),
                'isPublished' => filter_var($data['disclaimer_is_published'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ],
            self::TERMS => [
                'title' => (string) ($data['terms_title'] ?? 'Terms and Conditions'),
                'metaDescription' => (string) ($data['terms_meta_description'] ?? ''),
                'content' => (string) ($data['terms_content'] ?? ''),
                'isPublished' => filter_var($data['terms_is_published'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ],
        ];

        SiteSetting::setJson('legal_pages', $payload);
    }
}
