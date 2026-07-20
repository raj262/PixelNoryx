<?php

namespace App\Filament\Resources\KeywordPool;

use App\Filament\Resources\KeywordPool\Pages\CreateKeywordPoolItem;
use App\Filament\Resources\KeywordPool\Pages\EditKeywordPoolItem;
use App\Filament\Resources\KeywordPool\Pages\ListKeywordPoolItems;
use App\Filament\Resources\KeywordPool\Schemas\KeywordPoolForm;
use App\Filament\Resources\KeywordPool\Tables\KeywordPoolTable;
use App\Models\KeywordPoolItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class KeywordPoolResource extends Resource
{
    protected static ?string $model = KeywordPoolItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedKey;

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?string $navigationLabel = 'Keyword Pool';

    protected static ?string $modelLabel = 'Keyword';

    protected static ?string $pluralModelLabel = 'Keyword Pool';

    protected static ?int $navigationSort = 6;

    public static function form(Schema $schema): Schema
    {
        return KeywordPoolForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KeywordPoolTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListKeywordPoolItems::route('/'),
            'create' => CreateKeywordPoolItem::route('/create'),
            'edit' => EditKeywordPoolItem::route('/{record}/edit'),
        ];
    }
}
