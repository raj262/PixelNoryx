<?php

namespace App\Filament\Resources\AdPlacements;

use App\Filament\Resources\AdPlacements\Pages\CreateAdPlacement;
use App\Filament\Resources\AdPlacements\Pages\EditAdPlacement;
use App\Filament\Resources\AdPlacements\Pages\ListAdPlacements;
use App\Filament\Resources\AdPlacements\Schemas\AdPlacementForm;
use App\Filament\Resources\AdPlacements\Tables\AdPlacementsTable;
use App\Models\AdPlacement;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AdPlacementResource extends Resource
{
    protected static ?string $model = AdPlacement::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?string $navigationLabel = 'Ad placements';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return AdPlacementForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AdPlacementsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAdPlacements::route('/'),
            'create' => CreateAdPlacement::route('/create'),
            'edit' => EditAdPlacement::route('/{record}/edit'),
        ];
    }
}
