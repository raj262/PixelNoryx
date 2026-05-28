<?php

namespace App\Filament\Pages;

use App\Support\SiteContent;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
class ManageSiteContent extends Page
{
    /** @var array<string, mixed>|null */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Site content';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Site content';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill(SiteContent::adminFormData());
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Site')
                    ->schema([
                        TextInput::make('site_name')->required(),
                        TextInput::make('tagline')->required(),
                        Textarea::make('description')->rows(3)->columnSpanFull(),
                        TextInput::make('subscriber_count')->label('Subscriber count'),
                        TextInput::make('frequency'),
                        TextInput::make('contact_email')->email(),
                        TextInput::make('community_size')->label('Community size label'),
                    ])
                    ->columns(2),
                Section::make('AI chatbot (frontend)')
                    ->description('Floating AI assistant on the site. Requires OPENAI_API_KEY in backend/.env (see Admin → AI Studio).')
                    ->schema([
                        Toggle::make('ai_chat_enabled')
                            ->label('Show AI chat widget on website')
                            ->default(true),
                        TextInput::make('ai_chat_label')
                            ->label('Chat title')
                            ->default('PixelNoryx AI')
                            ->maxLength(64),
                    ])
                    ->columns(2),
                Section::make('WhatsApp chat')
                    ->description('Floating chat button on the website. Opens WhatsApp with a pre-filled message.')
                    ->schema([
                        Toggle::make('whatsapp_enabled')
                            ->label('Show WhatsApp button on site')
                            ->default(false),
                        TextInput::make('whatsapp_number')
                            ->label('WhatsApp number')
                            ->tel()
                            ->placeholder('919876543210')
                            ->helperText('Country code + number, digits only (no + or spaces). Example India: 91XXXXXXXXXX'),
                        TextInput::make('whatsapp_display')
                            ->label('Display label (optional)')
                            ->placeholder('+91 98765 43210'),
                        Textarea::make('whatsapp_message')
                            ->label('Default message')
                            ->rows(2)
                            ->default('Hi! I have a question about PixelNoryx.')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Author (About section)')
                    ->schema([
                        TextInput::make('author_name')->required(),
                        TextInput::make('author_role')->required(),
                        Textarea::make('author_bio')->rows(4)->columnSpanFull(),
                        FileUpload::make('author_image')
                            ->image()
                            ->directory('author')
                            ->visibility('public'),
                    ])
                    ->columns(2),
                Section::make('Top bar social stats')
                    ->schema([
                        Repeater::make('social_stats')
                            ->schema([
                                TextInput::make('label')->required(),
                                TextInput::make('count')->required(),
                                TextInput::make('href')->url()->required(),
                            ])
                            ->columns(3)
                            ->columnSpanFull(),
                    ]),
                Section::make('Navigation links')
                    ->schema([
                        Repeater::make('nav_links')
                            ->schema([
                                TextInput::make('label')->required(),
                                TextInput::make('href')->required(),
                                Toggle::make('hasDropdown')->label('Has dropdown'),
                            ])
                            ->columns(3)
                            ->columnSpanFull(),
                    ]),
                Section::make('Social links (sidebar/footer icons)')
                    ->schema([
                        Repeater::make('social_links')
                            ->schema([
                                TextInput::make('label')->required(),
                                TextInput::make('href')->url()->required(),
                                TextInput::make('icon')
                                    ->required()
                                    ->helperText('Twitter, Github, Linkedin, Youtube'),
                            ])
                            ->columns(3)
                            ->columnSpanFull(),
                    ]),
                Section::make('Subscribe benefits')
                    ->schema([
                        Repeater::make('subscribe_benefits')
                            ->schema([
                                TextInput::make('icon')
                                    ->required()
                                    ->helperText('Zap, Code, TrendingUp, Gift'),
                                TextInput::make('title')->required(),
                                Textarea::make('description')->required()->rows(2),
                            ])
                            ->columns(1)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        SiteContent::saveFromAdminForm($this->form->getState());

        Notification::make()
            ->success()
            ->title('Site content saved')
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save site content')
                ->submit('save')
                ->keyBindings(['mod+s']),
        ];
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
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
        return static::$title ?? 'Site content';
    }
}
