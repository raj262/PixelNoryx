<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use App\Services\Ai\AiService;
use App\Support\SiteContent;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Placeholder;
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
class ManageFrontendChatbot extends Page
{
    /** @var array<string, mixed>|null */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'AI Chatbot';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'AI Chatbot (frontend)';

    protected static ?string $slug = 'ai-chatbot';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill([
            'ai_chat_enabled' => SiteSetting::get('ai_chat_enabled', '1') === '1',
            'ai_chat_label' => SiteSetting::get('ai_chat_label', 'PixelNoryx AI'),
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        $configured = app(AiService::class)->isConfigured();
        $chatOn = SiteSetting::get('ai_chat_enabled', '1') === '1';

        return $schema
            ->components([
                Section::make('Visibility on website')
                    ->description('Turn the floating chat widget on or off for visitors at localhost:3000 (and your live site). Changes apply after the next page load.')
                    ->schema([
                        Toggle::make('ai_chat_enabled')
                            ->label('Enable chatbot on frontend')
                            ->helperText('When off, the chat pill, teaser, and navbar AI button are hidden.')
                            ->inline(false),
                        TextInput::make('ai_chat_label')
                            ->label('Chat window title')
                            ->maxLength(64)
                            ->placeholder('PixelNoryx AI'),
                    ]),
                Section::make('Status')
                    ->schema([
                        Placeholder::make('gemini_status')
                            ->label('Gemini API (backend)')
                            ->content($configured
                                ? 'Connected — '.config('ai.model').' ('.config('ai.provider').')'
                                : 'Not configured — add GEMINI_API_KEY to backend/.env and restart `php artisan serve`.'),
                        Placeholder::make('widget_status')
                            ->label('Widget on public site')
                            ->content(function () use ($configured, $chatOn): string {
                                if (! $chatOn) {
                                    return 'Hidden (chatbot disabled above).';
                                }
                                if (! $configured) {
                                    return 'Enabled in admin, but hidden until the API key is set (visitors would see errors).';
                                }

                                return 'Live — visitors see the chat widget and can send messages.';
                            }),
                    ]),
            ]);
    }

    public function save(): void
    {
        SiteContent::saveChatbotSettings($this->form->getState());

        Notification::make()
            ->success()
            ->title('Chatbot settings saved')
            ->body(
                ($this->data['ai_chat_enabled'] ?? false)
                    ? 'The frontend chat widget is enabled.'
                    : 'The frontend chat widget is disabled.'
            )
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save chatbot settings')
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
        return static::$title ?? 'AI Chatbot';
    }
}
