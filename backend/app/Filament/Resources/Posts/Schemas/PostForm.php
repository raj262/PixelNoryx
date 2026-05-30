<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Content')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', \Illuminate\Support\Str::slug($state))),
                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Select::make('user_id')
                            ->relationship('author', 'name')
                            ->label('Author')
                            ->searchable()
                            ->preload()
                            ->default(fn () => auth()->id()),
                        TextInput::make('issue_number')
                            ->numeric()
                            ->label('Issue #'),
                        Textarea::make('excerpt')
                            ->rows(3)
                            ->columnSpanFull(),
                        Textarea::make('preview')
                            ->rows(3)
                            ->columnSpanFull(),
                        RichEditor::make('content')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Media & Meta')
                    ->schema([
                        FileUpload::make('image')
                            ->image()
                            ->directory('posts')
                            ->visibility('public'),
                        TextInput::make('read_time')
                            ->default('5 min read')
                            ->maxLength(50),
                        Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'published' => 'Published',
                                'archived' => 'Archived',
                            ])
                            ->default('draft')
                            ->required()
                            ->helperText('Only Published posts appear on the site archive.'),
                        DateTimePicker::make('published_at')
                            ->helperText('Required for Published posts. Leave empty to use the save time.'),
                        Select::make('tags')
                            ->relationship('tags', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable(),
                    ])
                    ->columns(2),
                Section::make('SEO')
                    ->description('Search engines and social previews. Leave blank to use title and excerpt.')
                    ->schema([
                        TextInput::make('meta_title')
                            ->label('Meta title')
                            ->maxLength(70)
                            ->helperText('Overrides post title in search results.'),
                        Textarea::make('meta_description')
                            ->rows(3)
                            ->maxLength(320)
                            ->helperText('Overrides excerpt for meta description.'),
                        TextInput::make('meta_keywords')
                            ->label('Keywords')
                            ->placeholder('react, saas, laravel'),
                        FileUpload::make('og_image')
                            ->label('Open Graph image')
                            ->image()
                            ->directory('posts/og')
                            ->visibility('public')
                            ->helperText('Social share image. Falls back to featured image.'),
                        TextInput::make('canonical_url')
                            ->url()
                            ->placeholder('https://yoursite.com/archive/slug'),
                        TextInput::make('robots')
                            ->placeholder('index, follow')
                            ->default('index,follow'),
                    ])
                    ->columns(2)
                    ->collapsed(),
                Section::make('Flags')
                    ->schema([
                        Toggle::make('is_featured')->label('Featured'),
                        Toggle::make('is_free')->label('Free to read')->default(true),
                        Toggle::make('is_sponsored')->label('Sponsored'),
                        TextInput::make('comment_count')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(4),
            ]);
    }
}
