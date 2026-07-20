<?php

namespace App\Filament\Resources\KeywordPool\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class KeywordPoolForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('keyword')
                ->required()
                ->maxLength(255)
                ->helperText('Seed keyword for topic research (AI picks a unique angle — not a random free topic).'),
            Select::make('category_id')
                ->label('Preferred category')
                ->relationship('category', 'name')
                ->searchable()
                ->preload()
                ->nullable(),
            Select::make('priority')
                ->options([
                    'high' => 'High',
                    'normal' => 'Normal',
                    'low' => 'Low',
                ])
                ->default('normal')
                ->required(),
            Toggle::make('is_active')
                ->label('Active in pool')
                ->default(true),
            Textarea::make('notes')
                ->rows(3)
                ->helperText('Optional guidance for AI (audience, angle to prefer/avoid).'),
        ]);
    }
}
