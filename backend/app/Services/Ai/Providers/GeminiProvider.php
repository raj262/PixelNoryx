<?php

namespace App\Services\Ai\Providers;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiProvider
{
    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     */
    public function complete(array $messages, bool $json = false): string
    {
        $apiKey = config('ai.api_key');
        $model = config('ai.model');
        $baseUrl = rtrim((string) config('ai.gemini_base_url'), '/');

        if (! filled($apiKey)) {
            throw new RuntimeException(
                'AI is not configured. Add GEMINI_API_KEY from Google AI Studio (https://aistudio.google.com/apikey) to backend/.env'
            );
        }

        $systemInstruction = null;
        $contents = [];

        foreach ($messages as $msg) {
            $role = $msg['role'] ?? 'user';
            $content = $msg['content'] ?? '';

            if ($role === 'system') {
                $systemInstruction = ['parts' => [['text' => $content]]];

                continue;
            }

            $geminiRole = $role === 'assistant' ? 'model' : 'user';
            $contents[] = [
                'role' => $geminiRole,
                'parts' => [['text' => $content]],
            ];
        }

        if ($contents === []) {
            throw new RuntimeException('No messages to send to Gemini.');
        }

        $body = [
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => config('ai.temperature'),
                'maxOutputTokens' => config('ai.max_tokens'),
            ],
        ];

        if ($systemInstruction !== null) {
            $body['systemInstruction'] = $systemInstruction;
        }

        if ($json) {
            $body['generationConfig']['responseMimeType'] = 'application/json';
        }

        $url = "{$baseUrl}/models/{$model}:generateContent?key=".urlencode($apiKey);

        $response = Http::timeout(90)
            ->acceptJson()
            ->post($url, $body);

        if (! $response->successful()) {
            $message = $response->json('error.message')
                ?? $response->json('error.status')
                ?? $response->body();
            throw new RuntimeException('Gemini request failed: '.$message);
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            $blockReason = $response->json('candidates.0.finishReason');
            throw new RuntimeException(
                'Gemini returned an empty response.'
                .($blockReason ? " (finish: {$blockReason})" : '')
            );
        }

        return trim($text);
    }
}
