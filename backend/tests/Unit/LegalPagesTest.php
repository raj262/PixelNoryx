<?php

namespace Tests\Unit;

use App\Models\SiteSetting;
use App\Support\LegalPages;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        SiteSetting::query()->whereIn('key', ['legal_pages', 'footer_links'])->delete();
        parent::tearDown();
    }

    public function test_returns_default_privacy_policy(): void
    {
        $page = LegalPages::find(LegalPages::PRIVACY);

        $this->assertNotNull($page);
        $this->assertSame('Privacy Policy', $page['title']);
        $this->assertSame('/privacy-policy', $page['path']);
        $this->assertTrue($page['isPublished']);
        $this->assertStringContainsString('Google AdSense', $page['content']);
    }

    public function test_upgrades_legacy_privacy_policy_without_adsense_section(): void
    {
        SiteSetting::setJson('legal_pages', [
            LegalPages::PRIVACY => [
                'title' => 'Privacy Policy',
                'metaDescription' => 'Old',
                'content' => '<p>Old short policy without ads section.</p>',
                'isPublished' => true,
            ],
        ]);

        $page = LegalPages::find(LegalPages::PRIVACY);

        $this->assertStringContainsString('Google AdSense', $page['content']);
    }

    public function test_sync_footer_legal_links(): void
    {
        SiteSetting::setJson('footer_links', [
            'legal' => [
                ['label' => 'Privacy', 'href' => '#'],
                ['label' => 'Terms', 'href' => '#'],
            ],
        ]);

        LegalPages::syncFooterLegalLinks();

        $legal = SiteSetting::getJson('footer_links')['legal'];

        $this->assertSame('/privacy-policy', $legal[0]['href']);
        $this->assertSame('Privacy Policy', $legal[0]['label']);
    }

    public function test_keeps_custom_privacy_without_adsense_section(): void
    {
        LegalPages::saveFromAdminForm([
            'privacy_policy_title' => 'Custom Privacy',
            'privacy_policy_meta_description' => 'Custom meta',
            'privacy_policy_content' => '<p>My custom privacy policy without advertising section.</p>',
            'privacy_policy_is_published' => true,
            'disclaimer_title' => 'Disclaimer',
            'disclaimer_meta_description' => '',
            'disclaimer_content' => '<p>Disclaimer body</p>',
            'disclaimer_is_published' => true,
            'terms_title' => 'Terms',
            'terms_meta_description' => '',
            'terms_content' => '<p>Terms body</p>',
            'terms_is_published' => true,
        ]);

        $privacy = LegalPages::find(LegalPages::PRIVACY);

        $this->assertSame('<p>My custom privacy policy without advertising section.</p>', $privacy['content']);
    }

    public function test_saves_and_loads_admin_form_data(): void
    {
        LegalPages::saveFromAdminForm([
            'privacy_policy_title' => 'Custom Privacy',
            'privacy_policy_meta_description' => 'Custom meta',
            'privacy_policy_content' => '<p>Custom content with Google AdSense disclosure.</p>',
            'privacy_policy_is_published' => true,
            'disclaimer_title' => 'Custom Disclaimer',
            'disclaimer_meta_description' => 'Disclaimer meta',
            'disclaimer_content' => '<p>Disclaimer body</p>',
            'disclaimer_is_published' => false,
            'terms_title' => 'Custom Terms',
            'terms_meta_description' => 'Terms meta',
            'terms_content' => '<p>Terms body</p>',
            'terms_is_published' => true,
        ]);

        $privacy = LegalPages::find(LegalPages::PRIVACY);
        $disclaimer = LegalPages::find(LegalPages::DISCLAIMER);

        $this->assertSame('Custom Privacy', $privacy['title']);
        $this->assertSame('<p>Custom content with Google AdSense disclosure.</p>', $privacy['content']);
        $this->assertFalse($disclaimer['isPublished']);

        $index = LegalPages::publishedIndex();
        $slugs = array_column($index, 'slug');

        $this->assertContains(LegalPages::PRIVACY, $slugs);
        $this->assertContains(LegalPages::TERMS, $slugs);
        $this->assertNotContains(LegalPages::DISCLAIMER, $slugs);
    }
}
