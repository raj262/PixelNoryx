<?php

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required(),
            TextInput::make('role'),
            Textarea::make('content')->required()->rows(4)->columnSpanFull(),
            TextInput::make('image')->url()->label('Image URL'),
            TextInput::make('rating')->numeric()->default(5)->minValue(1)->maxValue(5),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }
}
