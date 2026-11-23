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
<p><strong>Last updated:</strong> June 8, 2026</p>
<p>PixelNoryx ("we", "us", "our") operates <a href="https://www.pixelnoryx.com">https://www.pixelnoryx.com</a>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, subscribe to our newsletter, or interact with our services.</p>
<p>By using PixelNoryx, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our website.</p>
<h2>Information we collect</h2>
<h3>Information you provide</h3>
<ul>
<li><strong>Email address</strong> when you subscribe to our newsletter</li>
<li><strong>Name</strong> if you choose to provide it during registration or contact</li>
<li><strong>Messages</strong> you send through contact forms, comments, or email</li>
</ul>
<h3>Information collected automatically</h3>
<ul>
<li>IP address, browser type, device type, and operating system</li>
<li>Pages viewed, time spent, referral URLs, and general usage data</li>
<li>Cookie and similar technology data (see below)</li>
</ul>
<h2>How we use your information</h2>
<ul>
<li>Deliver newsletter issues and service-related emails</li>
<li>Operate, maintain, and improve our website and content</li>
<li>Respond to inquiries and support requests</li>
<li>Monitor traffic, measure performance, and prevent abuse</li>
<li>Display relevant advertising through third-party partners</li>
<li>Comply with legal obligations</li>
</ul>
<p>We do <strong>not</strong> sell your personal email address to third parties.</p>
<h2>Cookies and similar technologies</h2>
<p>We use cookies and similar technologies to remember preferences, analyze traffic, and support advertising. Types of cookies we may use include:</p>
<ul>
<li><strong>Essential cookies</strong> — required for basic site functionality</li>
<li><strong>Analytics cookies</strong> — help us understand how visitors use the site (e.g. Google Analytics, Microsoft Clarity)</li>
<li><strong>Advertising cookies</strong> — used to deliver and measure ads, including through Google AdSense</li>
</ul>
<p>You can control or delete cookies through your browser settings. Disabling cookies may affect some site features.</p>
<h2>Google AdSense and advertising partners</h2>
<p>We use <strong>Google AdSense</strong> to display advertisements on PixelNoryx. Google and its partners may use cookies and web beacons to serve ads based on your visits to this site and other websites on the Internet.</p>
<p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</p>
<p>You may opt out of personalized advertising by visiting:</p>
<ul>
<li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
<li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">aboutads.info</a> (US)</li>
<li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">Your Online Choices</a> (EU)</li>
</ul>
<p>Learn more about how Google uses data from partner sites: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google Partner Sites Policy</a>.</p>
<h2>Analytics services</h2>
<p>We may use analytics providers such as <strong>Google Analytics</strong> and <strong>Microsoft Clarity</strong> to understand site usage. These services may collect information sent by your browser, including pages visited and interactions. You can learn about Google Analytics opt-out at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a>.</p>
<h2>Third-party links</h2>
<p>Our site may contain links to external websites. We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies.</p>
<h2>Data retention</h2>
<p>We retain newsletter subscriber data while you remain subscribed. You may unsubscribe at any time using the link in any email. Other data may be retained as needed for legal, security, or operational purposes.</p>
<h2>Your rights</h2>
<p>Depending on your location, you may have the right to access, correct, delete, or restrict processing of your personal data. To make a request, contact us using the details below.</p>
<h2>Children's privacy</h2>
<p>PixelNoryx is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us and we will remove it.</p>
<h2>Changes to this policy</h2>
<p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the site after changes means you accept the revised policy.</p>
<h2>Contact us</h2>
<p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:hello@pixelnoryx.com">hello@pixelnoryx.com</a></li>
<li><strong>Website:</strong> <a href="https://www.pixelnoryx.com/privacy-policy">https://www.pixelnoryx.com/privacy-policy</a></li>
</ul>
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
                'content' => self::resolveContent($slug, $page, $default['content']),
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

        self::syncFooterLegalLinks();
    }

    /** Keep footer legal links in sync with published legal pages (fixes stale `#` links). */
    public static function syncFooterLegalLinks(): void
    {
        $footerLinks = SiteSetting::getJson('footer_links', SiteContent::defaults()['footer_links']);

        $footerLinks['legal'] = [
            ['label' => 'Privacy Policy', 'href' => '/privacy-policy'],
            ['label' => 'Disclaimer', 'href' => '/disclaimer'],
            ['label' => 'Terms & Conditions', 'href' => '/terms-and-conditions'],
            ['label' => 'Contact', 'href' => '/contact'],
        ];

        SiteSetting::setJson('footer_links', $footerLinks);
    }

    private static function resolveContent(string $slug, array $page, string $defaultContent): string
    {
        if (! filled($page['content'] ?? null)) {
            return $defaultContent;
        }

        $content = (string) $page['content'];

        // Only auto-upgrade known legacy placeholder copy, not custom admin edits.
        if ($slug === self::PRIVACY && self::isLegacyPrivacyPlaceholder($content)) {
            return $defaultContent;
        }

        return $content;
    }

    private static function isLegacyPrivacyPlaceholder(string $content): bool
    {
        $plain = trim(strip_tags($content));

        if ($plain === '') {
            return true;
        }

        $legacySnippets = [
            'PixelNoryx respects your privacy. Contact hello@pixelnoryx.com for questions about this policy.',
            'Old short policy without ads section.',
        ];

        foreach ($legacySnippets as $snippet) {
            if (str_contains($plain, $snippet)) {
                return true;
            }
        }

        return false;
    }
}
