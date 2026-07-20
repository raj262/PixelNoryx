<?php

namespace App\Filament\Pages;

use App\Models\AutoBlogRun;
use App\Models\Category;
use App\Models\User;
use App\Services\AutoBlog\DailyPostPipeline;
use App\Support\AutoBlogSettings;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Placeholder;
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
class ManageAutoBlog extends Page
{
    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Auto Blog';

    protected static ?int $navigationSort = 4;

    protected static ?string $title = 'Daily Auto Blog';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill(AutoBlogSettings::all());
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Pipeline')
                ->description('Keyword Pool → Topic Research → Duplicate Check → Article Generate → Quality Validation → Draft/Publish. AI does not freely pick random topics.')
                ->schema([
                    Toggle::make('enabled')
                        ->label('Enable daily scheduler')
                        ->helperText('Requires server cron: * * * * * php artisan schedule:run'),
                    TextInput::make('run_at')
                        ->label('Daily run time')
                        ->placeholder('08:00')
                        ->required()
                        ->helperText('24h format, e.g. 08:00'),
                    TextInput::make('timezone')
                        ->required()
                        ->default('Asia/Kolkata'),
                    Select::make('default_status')
                        ->label('Save as')
                        ->options([
                            'draft' => 'Draft (recommended — review before publish)',
                            'published' => 'Published immediately',
                        ])
                        ->required()
                        ->helperText('Keep Draft until you trust the pipeline.'),
                    Toggle::make('skip_if_post_today')
                        ->label('Skip if already ran successfully today')
                        ->default(true),
                ])
                ->columns(2),
            Section::make('Quality & ownership')
                ->schema([
                    TextInput::make('min_words')
                        ->numeric()
                        ->required()
                        ->minValue(400),
                    TextInput::make('max_words')
                        ->numeric()
                        ->required()
                        ->minValue(800),
                    TextInput::make('similarity_threshold')
                        ->numeric()
                        ->step(0.01)
                        ->minValue(0.5)
                        ->maxValue(0.95)
                        ->helperText('0.72 = reject titles/slugs too similar to existing posts'),
                    Select::make('author_user_id')
                        ->label('Author')
                        ->options(fn () => User::query()->orderBy('name')->pluck('name', 'id'))
                        ->searchable()
                        ->nullable()
                        ->helperText('Defaults to first admin user if empty'),
                    Select::make('default_category_id')
                        ->label('Fallback category')
                        ->options(fn () => Category::query()->where('is_active', true)->orderBy('name')->pluck('name', 'id'))
                        ->searchable()
                        ->nullable(),
                ])
                ->columns(2),
            Section::make('Recent runs')
                ->schema([
                    Placeholder::make('runs_info')
                        ->label('')
                        ->content(function (): string {
                            $runs = AutoBlogRun::query()->latest()->limit(8)->get();
                            if ($runs->isEmpty()) {
                                return 'No runs yet. Add keywords, enable the scheduler, or click “Generate now”.';
                            }

                            return $runs->map(function (AutoBlogRun $run) {
                                $status = $run->status;
                                $title = $run->title ?: $run->topic ?: '—';
                                $when = $run->created_at?->format('M j, H:i');

                                return "{$when} · {$status} · {$title}".($run->error ? ' — '.$run->error : '');
                            })->implode("\n");
                        })
                        ->extraAttributes(['style' => 'white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 12px;']),
                ]),
        ]);
    }

    public function save(): void
    {
        AutoBlogSettings::save($this->form->getState());

        Notification::make()
            ->title('Auto Blog settings saved')
            ->success()
            ->send();
    }

    public function generateNow(DailyPostPipeline $pipeline): void
    {
        $result = $pipeline->run(force: true);

        if ($result['skipped'] ?? false) {
            Notification::make()->title('Skipped')->body($result['message'])->warning()->send();

            return;
        }

        if (! ($result['ok'] ?? false)) {
            Notification::make()->title('Generation failed')->body($result['message'])->danger()->send();

            return;
        }

        $post = $result['post'] ?? null;
        Notification::make()
            ->title('Post created')
            ->body($post ? "{$post->title} ({$post->status})" : $result['message'])
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save settings')
                ->submit('save')
                ->keyBindings(['mod+s']),
            Action::make('generateNow')
                ->label('Generate now')
                ->color('gray')
                ->requiresConfirmation()
                ->modalHeading('Run auto-blog pipeline now?')
                ->modalDescription('Uses the next keyword from the pool. Defaults to Draft unless you set Published.')
                ->action('generateNow'),
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
        return static::$title ?? 'Daily Auto Blog';
    }
}
