<?php

namespace App\Filament\Resources\Posts\Pages;

use App\Filament\Concerns\InteractsWithPostAi;
use App\Filament\Resources\Posts\PostResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditPost extends EditRecord
{
    use InteractsWithPostAi;

    protected static string $resource = PostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('publish')
                ->label('Publish now')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->visible(fn () => $this->record->status !== 'published')
                ->action(function (): void {
                    $this->record->update([
                        'status' => 'published',
                        'published_at' => $this->record->published_at ?? now(),
                    ]);

                    Notification::make()
                        ->success()
                        ->title('Post published')
                        ->body('It will appear on the site archive within a minute.')
                        ->send();

                    $this->refreshFormData(['status', 'published_at']);
                }),
            ...$this->getPostAiActions(),
            DeleteAction::make(),
        ];
    }
}
