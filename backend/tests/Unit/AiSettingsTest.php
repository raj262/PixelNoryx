<?php

namespace Tests\Unit;

use App\Models\SiteSetting;
use App\Support\AiSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Tests\TestCase;

class AiSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        SiteSetting::query()->whereIn('key', [
            'ai_enabled',
            'ai_provider',
            'ai_model',
            'openai_api_key',
            'gemini_api_key',
            'ai_max_tokens',
            'ai_temperature',
            'ai_rate_limit',
            'ai_base_url',
            'ai_gemini_base_url',
        ])->delete();

        parent::tearDown();
    }

    public function test_saves_openai_key_encrypted_and_applies_config(): void
    {
        AiSettings::save([
            'ai_enabled' => true,
            'ai_provider' => 'openai',
            'ai_model' => 'gpt-4o-mini',
            'ai_max_tokens' => 4096,
            'ai_temperature' => 0.7,
            'ai_rate_limit' => 20,
            'ai_base_url' => 'https://api.openai.com/v1',
            'openai_api_key' => 'sk-test-secret-key',
        ]);

        $stored = SiteSetting::get('openai_api_key');
        $this->assertNotSame('sk-test-secret-key', $stored);
        $this->assertSame('sk-test-secret-key', Crypt::decryptString((string) $stored));

        AiSettings::apply();

        $this->assertTrue(config('ai.enabled'));
        $this->assertSame('openai', config('ai.provider'));
        $this->assertSame('gpt-4o-mini', config('ai.model'));
        $this->assertSame('sk-test-secret-key', config('ai.api_key'));
        $this->assertTrue(AiSettings::isConfigured());
    }

    public function test_keeps_existing_key_when_blank_on_save(): void
    {
        AiSettings::save([
            'ai_enabled' => true,
            'ai_provider' => 'openai',
            'ai_model' => 'gpt-4o-mini',
            'ai_max_tokens' => 4096,
            'ai_temperature' => 0.7,
            'ai_rate_limit' => 20,
            'ai_base_url' => 'https://api.openai.com/v1',
            'openai_api_key' => 'sk-original',
        ]);

        AiSettings::save([
            'ai_enabled' => true,
            'ai_provider' => 'openai',
            'ai_model' => 'gpt-4o',
            'ai_max_tokens' => 8192,
            'ai_temperature' => 0.5,
            'ai_rate_limit' => 10,
            'ai_base_url' => 'https://api.openai.com/v1',
        ]);

        $this->assertSame('sk-original', AiSettings::openaiApiKey());
        $this->assertSame('gpt-4o', config('ai.model'));
    }
}
