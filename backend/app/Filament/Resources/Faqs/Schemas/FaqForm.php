<?php

namespace App\Filament\Resources\Faqs\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FaqForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('FAQ')
                ->schema([
                    TextInput::make('question')
                        ->label('Question')
                        ->required()
                        ->maxLength(500)
                        ->columnSpanFull(),
                    Textarea::make('answer')
                        ->label('Answer')
                        ->required()
                        ->rows(6)
                        ->columnSpanFull()
                        ->helperText('Shown on the homepage FAQ section.'),
                    TextInput::make('sort_order')
                        ->label('Sort order')
                        ->numeric()
                        ->default(0)
                        ->helperText('Lower numbers appear first.'),
                    Toggle::make('is_active')
                        ->label('Published')
                        ->default(true),
                ])
                ->columns(2),
        ]);
    }
}
