<?php

namespace App\Filament\Resources\AdPlacements\Tables;

use App\Models\AdPlacement;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AdPlacementsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('placement_key')->searchable()->sortable(),
                TextColumn::make('title')->searchable()->limit(40),
                TextColumn::make('size')->badge(),
                TextColumn::make('starts_at')
                    ->label('From')
                    ->date()
                    ->sortable(),
                TextColumn::make('ends_at')
                    ->label('To')
                    ->date()
                    ->sortable(),
                TextColumn::make('schedule_status')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn (AdPlacement $record): string => $record->scheduleStatus())
                    ->color(fn (string $state): string => match ($state) {
                        'live' => 'success',
                        'scheduled' => 'warning',
                        'expired' => 'danger',
                        default => 'gray',
                    }),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
