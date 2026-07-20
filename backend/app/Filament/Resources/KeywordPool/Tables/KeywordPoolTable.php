<?php

namespace App\Filament\Resources\KeywordPool\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class KeywordPoolTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('keyword')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('category.name')
                    ->label('Category')
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('priority')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'high' => 'danger',
                        'low' => 'gray',
                        default => 'info',
                    })
                    ->sortable(),
                IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                TextColumn::make('times_used')
                    ->label('Used')
                    ->sortable(),
                TextColumn::make('last_used_at')
                    ->dateTime()
                    ->placeholder('Never')
                    ->sortable(),
            ])
            ->defaultSort('times_used')
            ->filters([
                TernaryFilter::make('is_active')->label('Active'),
                SelectFilter::make('priority')->options([
                    'high' => 'High',
                    'normal' => 'Normal',
                    'low' => 'Low',
                ]),
            ])
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
