<?php

namespace App\Filament\Resources\KeywordPool\Pages;

use App\Filament\Resources\KeywordPool\KeywordPoolResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListKeywordPoolItems extends ListRecords
{
    protected static string $resource = KeywordPoolResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
