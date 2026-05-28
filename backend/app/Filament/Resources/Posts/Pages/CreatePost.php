<?php

namespace App\Filament\Resources\Posts\Pages;

use App\Filament\Concerns\InteractsWithPostAi;
use App\Filament\Resources\Posts\PostResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    use InteractsWithPostAi;

    protected static string $resource = PostResource::class;

    protected function getHeaderActions(): array
    {
        return $this->getPostAiActions();
    }
}
