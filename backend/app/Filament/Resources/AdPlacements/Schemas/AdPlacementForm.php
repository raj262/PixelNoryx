<?php

namespace App\Filament\Resources\AdPlacements\Schemas;

use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AdPlacementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Placement')
                    ->schema([
                        TextInput::make('placement_key')
                            ->label('Placement key')
                            ->required()
                            ->maxLength(64)
                            ->unique(ignoreRecord: true)
                            ->helperText('e.g. header, midPage, footerBanner'),
                        Select::make('size')
                            ->options([
                                'leaderboard' => 'Leaderboard',
                                'billboard' => 'Billboard',
                                'rectangle' => 'Rectangle',
                                'skyscraper' => 'Skyscraper',
                                'banner' => 'Banner',
                                'native' => 'Native',
                            ])
                            ->required(),
                        Select::make('gradient_key')
                            ->label('Gradient style')
                            ->options([
                                'violetSunset' => 'Violet sunset',
                                'slateHero' => 'Slate hero',
                                'ocean' => 'Ocean',
                                'brand' => 'Brand red',
                                'indigo' => 'Indigo',
                                'editorial' => 'Editorial',
                                'zinc' => 'Zinc dark',
                            ])
                            ->required(),
                        Toggle::make('is_active')->default(true),
                        TextInput::make('sort_order')->numeric()->default(0),
                    ])
                    ->columns(2),
                Section::make('Schedule')
                    ->description('The ad is hidden on the website before the start date and after the end date.')
                    ->schema([
                        Select::make('duration_preset')
                            ->label('Quick duration')
                            ->options([
                                'custom' => 'Custom dates',
                                '1' => '1 month',
                                '3' => '3 months',
                                '6' => '6 months',
                                '12' => '1 year',
                            ])
                            ->default('1')
                            ->live()
                            ->dehydrated(false)
                            ->afterStateUpdated(function (?string $state, callable $set, callable $get): void {
                                if (! $state || $state === 'custom') {
                                    return;
                                }

                                $start = $get('starts_at') ?? now()->toDateString();
                                if (! $get('starts_at')) {
                                    $set('starts_at', $start);
                                }

                                $end = Carbon::parse($start)
                                    ->addMonths((int) $state)
                                    ->toDateString();

                                $set('ends_at', $end);
                            }),
                        DatePicker::make('starts_at')
                            ->label('Date from')
                            ->required()
                            ->default(now())
                            ->native(false)
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set, callable $get): void {
                                $preset = $get('duration_preset');
                                if (! $state || ! $preset || $preset === 'custom') {
                                    return;
                                }

                                $end = Carbon::parse($state)
                                    ->addMonths((int) $preset)
                                    ->toDateString();

                                $set('ends_at', $end);
                            }),
                        DatePicker::make('ends_at')
                            ->label('Date to')
                            ->required()
                            ->native(false)
                            ->afterOrEqual('starts_at')
                            ->helperText('After this date the ad will not appear on the site.'),
                    ])
                    ->columns(3),
                Section::make('Creative')
                    ->schema([
                        TextInput::make('title')->required()->maxLength(255)->columnSpanFull(),
                        Textarea::make('subtitle')->rows(2)->columnSpanFull(),
                        TextInput::make('cta')->label('Button label')->maxLength(64),
                        TextInput::make('href')->label('Link URL')->maxLength(500),
                        TextInput::make('sponsor')->maxLength(64),
                    ])
                    ->columns(2),
            ]);
    }
}
