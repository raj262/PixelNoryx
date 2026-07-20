<?php

namespace App\Filament\Pages;

use App\Support\AiSettings;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
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
class ManageAiSettings extends Page
{
    /** @var array<string, mixed>|null */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCpuChip;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'AI / ChatGPT';

    protected static ?int $navigationSort = 5;

    protected static ?string $title = 'AI & ChatGPT Tokens';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill(AiSettings::all());
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Provider & API tokens')
                ->description('Manage ChatGPT / OpenAI or Gemini keys from admin. Keys are stored encrypted. Env keys are used only as fallback.')
                ->schema([
                    Toggle::make('ai_enabled')
                        ->label('Enable AI')
                        ->live(),
                    Select::make('ai_provider')
                        ->label('Provider')
                        ->options([
                            'openai' => 'OpenAI (ChatGPT)',
                            'gemini' => 'Google Gemini',
                        ])
                        ->required()
                        ->live()
                        ->helperText('Use OpenAI for ChatGPT models (gpt-4o-mini, gpt-4o, etc.).'),
                    TextInput::make('openai_api_key')
                        ->label('OpenAI / ChatGPT API key')
                        ->password()
                        ->revealable()
                        ->visible(fn (): bool => ($this->data['ai_provider'] ?? 'openai') === 'openai')
                        ->helperText(fn (): string => ($this->data['openai_api_key_set'] ?? false)
                            ? 'Leave blank to keep the current key. Get a key from platform.openai.com'
                            : 'Paste your sk-… key from platform.openai.com')
                        ->dehydrated(fn ($state) => filled($state)),
                    TextInput::make('gemini_api_key')
                        ->label('Gemini API key')
                        ->password()
                        ->revealable()
                        ->visible(fn (): bool => in_array($this->data['ai_provider'] ?? '', ['gemini', 'google'], true))
                        ->helperText(fn (): string => ($this->data['gemini_api_key_set'] ?? false)
                            ? 'Leave blank to keep the current key.'
                            : 'Get a key from Google AI Studio (aistudio.google.com)')
                        ->dehydrated(fn ($state) => filled($state)),
                    TextInput::make('ai_model')
                        ->label('Model')
                        ->required()
                        ->placeholder(fn (): string => ($this->data['ai_provider'] ?? 'openai') === 'openai'
                            ? 'gpt-4o-mini'
                            : 'gemini-2.0-flash')
                        ->helperText('Examples: gpt-4o-mini, gpt-4o, gemini-2.0-flash'),
                ])
                ->columns(2),
            Section::make('Generation limits')
                ->schema([
                    TextInput::make('ai_max_tokens')
                        ->label('Max tokens')
                        ->numeric()
                        ->required()
                        ->minValue(256)
                        ->helperText('Use 4096+ for long blog posts.'),
                    TextInput::make('ai_temperature')
                        ->label('Temperature')
                        ->numeric()
                        ->step(0.1)
                        ->minValue(0)
                        ->maxValue(2)
                        ->required(),
                    TextInput::make('ai_rate_limit')
                        ->label('API rate limit / minute')
                        ->numeric()
                        ->required()
                        ->minValue(1),
                    TextInput::make('ai_base_url')
                        ->label('OpenAI base URL')
                        ->url()
                        ->visible(fn (): bool => ($this->data['ai_provider'] ?? 'openai') === 'openai')
                        ->helperText('Default: https://api.openai.com/v1'),
                    TextInput::make('ai_gemini_base_url')
                        ->label('Gemini base URL')
                        ->url()
                        ->visible(fn (): bool => in_array($this->data['ai_provider'] ?? '', ['gemini', 'google'], true)),
                ])
                ->columns(2),
            Section::make('Status')
                ->schema([
                    \Filament\Forms\Components\Placeholder::make('ai_status')
                        ->label('')
                        ->content(function (): string {
                            AiSettings::apply();
                            $configured = AiSettings::isConfigured();
                            $s = AiSettings::all();
                            $provider = $s['ai_provider'] ?? 'openai';
                            $model = $s['ai_model'] ?? '—';
                            $keyOk = $configured ? 'API key set' : 'API key missing';

                            return $configured
                                ? "Ready — {$provider} / {$model} ({$keyOk})"
                                : "Not ready — enable AI and save a ChatGPT or Gemini API key ({$keyOk}).";
                        }),
                ]),
        ]);
    }

    public function save(): void
    {
        AiSettings::save($this->form->getState());

        Notification::make()
            ->title('AI settings saved')
            ->success()
            ->send();

        $this->form->fill(AiSettings::all());
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save AI settings')
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
        return static::$title ?? 'AI & ChatGPT Tokens';
    }
}
