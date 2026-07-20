<?php

namespace App\Filament\Resources\KeywordPool\Pages;

use App\Filament\Resources\KeywordPool\KeywordPoolResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditKeywordPoolItem extends EditRecord
{
    protected static string $resource = KeywordPoolResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
