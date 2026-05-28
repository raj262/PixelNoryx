<?php

namespace App\Filament\Concerns;

use App\Services\Ai\AiService;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

trait InteractsWithPostAi
{
    /**
     * @return array<int, Action>
     */
    protected function getPostAiActions(): array
    {
        return [
            Action::make('aiDraftPost')
                ->label('AI draft')
                ->icon(Heroicon::OutlinedSparkles)
                ->color('primary')
                ->visible(fn (): bool => app(AiService::class)->isConfigured())
                ->form([
                    Textarea::make('brief')
                        ->label('What should this article cover?')
                        ->required()
                        ->rows(4)
                        ->placeholder('e.g. Building a multi-vendor Laravel API with Sanctum and React admin'),
                ])
                ->action(function (array $data, AiService $ai): void {
                    try {
                        $draft = $ai->generate('post_draft', $data['brief']);
                        $fill = array_filter([
                            'title' => $draft['title'] ?? null,
                            'slug' => $draft['slug'] ?? (isset($draft['title']) ? Str::slug($draft['title']) : null),
                            'excerpt' => $draft['excerpt'] ?? null,
                            'preview' => $draft['preview'] ?? null,
                            'content' => $draft['content'] ?? null,
                            'read_time' => $draft['read_time'] ?? null,
                            'meta_title' => $draft['meta_title'] ?? null,
                            'meta_description' => $draft['meta_description'] ?? null,
                            'meta_keywords' => is_array($draft['tags'] ?? null)
                                ? implode(', ', $draft['tags'])
                                : ($draft['meta_keywords'] ?? null),
                        ], fn ($v) => $v !== null && $v !== '');

                        $this->form->fill(array_merge($this->form->getState(), $fill));

                        Notification::make()
                            ->success()
                            ->title('AI draft applied')
                            ->body('Review and edit before publishing.')
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->danger()
                            ->title('AI failed')
                            ->body($e->getMessage())
                            ->send();
                    }
                }),
            Action::make('aiSeoPost')
                ->label('AI SEO')
                ->icon(Heroicon::OutlinedMagnifyingGlass)
                ->visible(fn (): bool => app(AiService::class)->isConfigured())
                ->action(function (AiService $ai): void {
                    $state = $this->form->getState();
                    if (empty($state['title'])) {
                        Notification::make()
                            ->warning()
                            ->title('Add a title first')
                            ->send();

                        return;
                    }

                    try {
                        $seo = $ai->generate('seo', 'Optimize SEO for this post.', [
                            'title' => $state['title'],
                            'excerpt' => $state['excerpt'] ?? '',
                        ]);

                        $this->form->fill(array_merge($state, array_filter([
                            'meta_title' => $seo['meta_title'] ?? null,
                            'meta_description' => $seo['meta_description'] ?? null,
                            'meta_keywords' => $seo['meta_keywords'] ?? null,
                        ])));

                        Notification::make()->success()->title('SEO fields updated')->send();
                    } catch (\Throwable $e) {
                        Notification::make()->danger()->title('AI failed')->body($e->getMessage())->send();
                    }
                }),
        ];
    }
}
