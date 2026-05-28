<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AiChatRequest;
use App\Http\Requests\AiGenerateRequest;
use App\Services\Ai\AiService;
use Illuminate\Http\JsonResponse;

class AiController extends Controller
{
    public function __construct(
        protected AiService $ai,
    ) {}

    public function status(): JsonResponse
    {
        return response()->json([
            'data' => $this->ai->status(),
        ]);
    }

    public function chat(AiChatRequest $request): JsonResponse
    {
        if (! $this->ai->isConfigured()) {
            return response()->json([
                'message' => 'AI assistant is not configured yet.',
            ], 503);
        }

        try {
            $messages = [];
            foreach ($request->validated('history', []) as $turn) {
                $messages[] = [
                    'role' => $turn['role'],
                    'content' => $turn['content'],
                ];
            }
            $messages[] = [
                'role' => 'user',
                'content' => $request->validated('message'),
            ];

            $reply = $this->ai->chat($messages);

            return response()->json([
                'data' => [
                    'reply' => $reply,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function generate(AiGenerateRequest $request): JsonResponse
    {
        if (! $this->ai->isConfigured()) {
            return response()->json([
                'message' => 'AI is not configured yet.',
            ], 503);
        }

        try {
            $result = $this->ai->generate(
                $request->validated('type'),
                $request->validated('prompt'),
                $request->validated('context', []),
            );

            return response()->json([
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
