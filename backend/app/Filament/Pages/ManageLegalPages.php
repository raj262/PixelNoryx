<?php

namespace App\Filament\Pages;

use App\Support\LegalPages;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
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
class ManageLegalPages extends Page
{
    /** @var array<string, mixed>|null */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Legal pages';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Legal pages';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill(LegalPages::adminFormData());
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Privacy Policy')
                    ->description('Public URL: /privacy-policy')
                    ->schema([
                        Toggle::make('privacy_policy_is_published')
                            ->label('Published')
                            ->default(true),
                        TextInput::make('privacy_policy_title')
                            ->label('Page title')
                            ->required()
                            ->maxLength(120),
                        Textarea::make('privacy_policy_meta_description')
                            ->label('Meta description')
                            ->rows(2)
                            ->maxLength(320)
                            ->columnSpanFull(),
                        RichEditor::make('privacy_policy_content')
                            ->label('Content')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Disclaimer')
                    ->description('Public URL: /disclaimer')
                    ->schema([
                        Toggle::make('disclaimer_is_published')
                            ->label('Published')
                            ->default(true),
                        TextInput::make('disclaimer_title')
                            ->label('Page title')
                            ->required()
                            ->maxLength(120),
                        Textarea::make('disclaimer_meta_description')
                            ->label('Meta description')
                            ->rows(2)
                            ->maxLength(320)
                            ->columnSpanFull(),
                        RichEditor::make('disclaimer_content')
                            ->label('Content')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Terms and Conditions')
                    ->description('Public URL: /terms-and-conditions')
                    ->schema([
                        Toggle::make('terms_is_published')
                            ->label('Published')
                            ->default(true),
                        TextInput::make('terms_title')
                            ->label('Page title')
                            ->required()
                            ->maxLength(120),
                        Textarea::make('terms_meta_description')
                            ->label('Meta description')
                            ->rows(2)
                            ->maxLength(320)
                            ->columnSpanFull(),
                        RichEditor::make('terms_content')
                            ->label('Content')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public function save(): void
    {
        LegalPages::saveFromAdminForm($this->form->getState());

        Notification::make()
            ->success()
            ->title('Legal pages saved')
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save legal pages')
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
        return static::$title ?? 'Legal pages';
    }
}
