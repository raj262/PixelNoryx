<?php

namespace App\Services\Ai\Providers;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiProvider
{
    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     */
    public function complete(array $messages): string
    {
        $apiKey = config('ai.api_key');

        if (! filled($apiKey)) {
            throw new RuntimeException('AI is not configured. Add OPENAI_API_KEY to backend/.env');
        }

        $response = Http::timeout(90)
            ->withToken($apiKey)
            ->acceptJson()
            ->post(config('ai.base_url').'/chat/completions', [
                'model' => config('ai.model'),
                'messages' => $messages,
                'max_tokens' => config('ai.max_tokens'),
                'temperature' => config('ai.temperature'),
            ]);

        if (! $response->successful()) {
            $message = $response->json('error.message') ?? $response->body();
            throw new RuntimeException('AI request failed: '.$message);
        }

        $content = $response->json('choices.0.message.content');

        if (! is_string($content) || trim($content) === '') {
            throw new RuntimeException('AI returned an empty response.');
        }

        return trim($content);
    }
}
