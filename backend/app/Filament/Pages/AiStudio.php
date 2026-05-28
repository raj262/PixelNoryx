<?php

namespace App\Filament\Pages;

use App\Services\Ai\AiService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
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
class AiStudio extends Page
{
    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?string $navigationLabel = 'AI Studio';

    protected static ?int $navigationSort = 10;

    protected static ?string $title = 'AI Studio';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->hasRole('editor'));
    }

    public function mount(): void
    {
        $this->form->fill([
            'chat_message' => '',
            'chat_reply' => '',
            'generate_type' => 'faq',
            'generate_prompt' => '',
            'generate_output' => '',
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        $aiConfigured = app(AiService::class)->isConfigured();

        return $schema
            ->components([
                Section::make('AI status')
                    ->description($aiConfigured
                        ? 'Connected to '.config('ai.model').'. The public site shows an AI chat widget when enabled.'
                        : 'Set OPENAI_API_KEY in backend/.env, then restart php artisan serve.'),
                Section::make('Site assistant (test)')
                    ->schema([
                        Textarea::make('chat_message')
                            ->label('Message')
                            ->rows(3)
                            ->placeholder('What Laravel content do you recommend?')
                            ->columnSpanFull(),
                        Textarea::make('chat_reply')
                            ->label('Reply')
                            ->rows(8)
                            ->disabled()
                            ->visible(fn (): bool => filled($this->data['chat_reply'] ?? null))
                            ->columnSpanFull(),
                    ]),
                Section::make('Content generator')
                    ->schema([
                        Select::make('generate_type')
                            ->label('Type')
                            ->options([
                                'post_draft' => 'Full post draft (JSON)',
                                'faq' => 'FAQ entry',
                                'ad_copy' => 'Ad placement copy',
                                'seo' => 'SEO meta pack',
                            ])
                            ->required(),
                        Textarea::make('generate_prompt')
                            ->label('Prompt')
                            ->required()
                            ->rows(5)
                            ->columnSpanFull(),
                        Textarea::make('generate_output')
                            ->label('Generated JSON')
                            ->rows(14)
                            ->disabled()
                            ->visible(fn (): bool => filled($this->data['generate_output'] ?? null))
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function runChat(): void
    {
        $message = trim((string) ($this->data['chat_message'] ?? ''));
        if ($message === '') {
            Notification::make()->warning()->title('Enter a message')->send();

            return;
        }

        try {
            $reply = app(AiService::class)->chat([
                ['role' => 'user', 'content' => $message],
            ]);

            $this->data['chat_reply'] = $reply;
            $this->form->fill($this->data);

            Notification::make()->success()->title('Reply received')->send();
        } catch (\Throwable $e) {
            Notification::make()->danger()->title('Chat failed')->body($e->getMessage())->send();
        }
    }

    public function runGenerate(): void
    {
        $type = (string) ($this->data['generate_type'] ?? '');
        $prompt = trim((string) ($this->data['generate_prompt'] ?? ''));

        if ($prompt === '') {
            Notification::make()->warning()->title('Enter a prompt')->send();

            return;
        }

        try {
            $result = app(AiService::class)->generate($type, $prompt);
            $this->data['generate_output'] = json_encode(
                $result,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
            );
            $this->form->fill($this->data);

            Notification::make()
                ->success()
                ->title('Generated')
                ->body('Copy JSON into Posts, FAQs, or Ad placements.')
                ->send();
        } catch (\Throwable $e) {
            Notification::make()->danger()->title('Generate failed')->body($e->getMessage())->send();
        }
    }

    protected function getFormActions(): array
    {
        $configured = app(AiService::class)->isConfigured();

        return [
            Action::make('runChat')
                ->label('Test chat')
                ->icon(Heroicon::OutlinedPaperAirplane)
                ->disabled(! $configured)
                ->action('runChat'),
            Action::make('runGenerate')
                ->label('Generate')
                ->icon(Heroicon::OutlinedSparkles)
                ->color('gray')
                ->disabled(! $configured)
                ->action('runGenerate'),
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
            ->footer([
                Actions::make($this->getFormActions())
                    ->alignment('start')
                    ->key('form-actions'),
            ]);
    }

    public function getTitle(): string|Htmlable
    {
        return static::$title ?? 'AI Studio';
    }
}
