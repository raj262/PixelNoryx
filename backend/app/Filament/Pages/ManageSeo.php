<?php

namespace App\Filament\Pages;

use App\Support\SeoSettings;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class ManageSeo extends Page
{
    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMagnifyingGlass;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'SEO';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'SEO Management';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill(SeoSettings::all());
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema
            ->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Site & defaults')
                    ->description('Global defaults used when a page has no custom SEO.')
                    ->schema([
                        TextInput::make('seo_site_url')
                            ->label('Public site URL')
                            ->url()
                            ->required()
                            ->placeholder('http://localhost:3000')
                            ->helperText('Used for canonical URLs and Open Graph links.'),
                        TextInput::make('seo_default_title')
                            ->required()
                            ->maxLength(70)
                            ->helperText('Fallback browser title (aim for under 60 characters).'),
                        Textarea::make('seo_default_description')
                            ->required()
                            ->rows(3)
                            ->maxLength(320)
                            ->helperText('Fallback meta description (aim for 150–160 characters).'),
                        TextInput::make('seo_default_keywords')
                            ->label('Default keywords')
                            ->placeholder('react, laravel, newsletter')
                            ->helperText('Comma-separated keywords.'),
                        TextInput::make('seo_title_template')
                            ->label('Title template')
                            ->placeholder('%s | PixelNoryx')
                            ->helperText('Use %s for the page title (e.g. post title).'),
                        TextInput::make('seo_robots')
                            ->label('Default robots')
                            ->default('index, follow')
                            ->helperText('e.g. index, follow or noindex, nofollow'),
                    ])
                    ->columns(2),
                Section::make('Homepage')
                    ->schema([
                        TextInput::make('seo_home_title')
                            ->label('Home title')
                            ->required()
                            ->maxLength(70),
                        Textarea::make('seo_home_description')
                            ->label('Home description')
                            ->required()
                            ->rows(3)
                            ->maxLength(320),
                        TextInput::make('seo_home_keywords')
                            ->label('Home keywords')
                            ->placeholder('tech magazine, developer blog'),
                    ])
                    ->columns(2),
                Section::make('Social & verification')
                    ->schema([
                        FileUpload::make('seo_og_image')
                            ->disk('public')
                            ->label('Default share image (OG)')
                            ->image()
                            ->directory('seo')
                            ->visibility('public')
                            ->helperText('Recommended 1200×630. Used when a post has no OG image.'),
                        TextInput::make('seo_twitter_handle')
                            ->label('Twitter / X handle')
                            ->placeholder('@pixelnoryx'),
                        TextInput::make('seo_google_site_verification')
                            ->label('Google Search Console verification'),
                        TextInput::make('seo_bing_site_verification')
                            ->label('Bing Webmaster verification'),
                    ])
                    ->columns(2),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        SeoSettings::save($data);

        Notification::make()
            ->success()
            ->title('SEO settings saved')
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save SEO settings')
                ->submit('save')
                ->keyBindings(['mod+s']),
        ];
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->getFormContentComponent(),
            ]);
    }

    public function getFormContentComponent(): Component
    {
        return Form::make([EmbeddedSchema::make('form')])
            ->id('form')
            ->livewireSubmitHandler('save')
            ->footer([
                Actions::make($this->getFormActions())
                    ->alignment('start')
                    ->key('form-actions'),
            ]);
    }

    public function getTitle(): string|Htmlable
    {
        return static::$title ?? 'SEO Management';
    }
}
