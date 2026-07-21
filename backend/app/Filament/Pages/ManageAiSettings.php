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

    protected static ?string $title = 'ChatGPT (OpenAI)';

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
            Section::make('ChatGPT API')
                ->description('Uses OpenAI ChatGPT only (not Gemini). Get your key from platform.openai.com. Keys are stored encrypted.')
                ->schema([
                    Toggle::make('ai_enabled')
                        ->label('Enable ChatGPT')
                        ->live(),
                    TextInput::make('openai_api_key')
                        ->label('OpenAI API key')
                        ->password()
                        ->revealable()
                        ->helperText(fn (): string => ($this->data['openai_api_key_set'] ?? false)
                            ? 'Leave blank to keep the current key.'
                            : 'Paste your sk-… key from platform.openai.com')
                        ->dehydrated(fn ($state) => filled($state)),
                    Select::make('ai_model')
                        ->label('ChatGPT model')
                        ->options([
                            'gpt-4o-mini' => 'gpt-4o-mini (fast / cheaper — recommended)',
                            'gpt-4o' => 'gpt-4o (higher quality)',
                            'gpt-4.1-mini' => 'gpt-4.1-mini',
                            'gpt-4.1' => 'gpt-4.1',
                            'o4-mini' => 'o4-mini',
                        ])
                        ->searchable()
                        ->required()
                        ->helperText('Or type a custom OpenAI model name below if needed.'),
                    TextInput::make('ai_model_custom')
                        ->label('Custom model (optional)')
                        ->placeholder('e.g. gpt-4o-mini')
                        ->helperText('If filled, this overrides the dropdown.')
                        ->dehydrated(false),
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
                        ->required()
                        ->helperText('Default: https://api.openai.com/v1'),
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
                            $model = $s['ai_model'] ?? 'gpt-4o-mini';

                            return $configured
                                ? "Ready — ChatGPT / {$model}"
                                : 'Not ready — enable ChatGPT and paste your OpenAI API key, then Save.';
                        }),
                ]),
        ]);
    }

    public function save(): void
    {
        $state = $this->form->getState();
        $custom = trim((string) ($this->data['ai_model_custom'] ?? ''));
        if ($custom !== '') {
            $state['ai_model'] = $custom;
        }

        // Always ChatGPT / OpenAI — never Gemini
        $state['ai_provider'] = 'openai';

        AiSettings::save($state);

        Notification::make()
            ->title('ChatGPT settings saved')
            ->success()
            ->send();

        $this->form->fill(AiSettings::all());
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save ChatGPT settings')
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
        return static::$title ?? 'ChatGPT (OpenAI)';
    }
}
