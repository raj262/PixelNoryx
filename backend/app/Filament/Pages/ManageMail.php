<?php

namespace App\Filament\Pages;

use App\Mail\TestMail;
use App\Support\MailSettings;
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
use Illuminate\Support\Facades\Mail;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class ManageMail extends Page
{
    /** @var array<string, mixed>|null */
    public ?array $data = [];

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Email (SMTP)';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Email & Gmail SMTP';

    protected string $view = 'filament-panels::pages.page';

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(): void
    {
        $this->form->fill(MailSettings::all());
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Gmail SMTP')
                    ->description('Use a Google App Password (not your normal Gmail password). Google Account → Security → 2-Step Verification → App passwords.')
                    ->schema([
                        Toggle::make('mail_enabled')
                            ->label('Enable SMTP email')
                            ->live(),
                        TextInput::make('mail_host')
                            ->label('SMTP host')
                            ->default('smtp.gmail.com')
                            ->required(),
                        TextInput::make('mail_port')
                            ->label('Port')
                            ->numeric()
                            ->default(587)
                            ->required(),
                        Select::make('mail_encryption')
                            ->label('Encryption')
                            ->options([
                                'tls' => 'TLS (port 587 — Gmail recommended)',
                                'ssl' => 'SSL (port 465)',
                                'none' => 'None',
                            ])
                            ->default('tls')
                            ->required(),
                        TextInput::make('mail_username')
                            ->label('Gmail address')
                            ->email()
                            ->placeholder('you@gmail.com')
                            ->required(),
                        TextInput::make('mail_password')
                            ->label('App password')
                            ->password()
                            ->revealable()
                            ->helperText(fn (): string => ($this->data['mail_password_set'] ?? false)
                                ? 'Leave blank to keep the current app password.'
                                : '16-character Google App Password.')
                            ->dehydrated(fn ($state) => filled($state)),
                        TextInput::make('mail_from_address')
                            ->label('From email')
                            ->email()
                            ->helperText('Usually the same as your Gmail address.'),
                        TextInput::make('mail_from_name')
                            ->label('From name')
                            ->default('PixelNoryx'),
                        TextInput::make('mail_admin_to')
                            ->label('Admin inbox')
                            ->email()
                            ->helperText('Contact & subscriber alerts go here. Defaults to site contact email.'),
                    ])
                    ->columns(2),
                Section::make('Notifications')
                    ->schema([
                        Toggle::make('mail_notify_contact')
                            ->label('Email admin on new contact form message'),
                        Toggle::make('mail_notify_subscribe_admin')
                            ->label('Email admin on new subscriber'),
                        Toggle::make('mail_notify_subscribe_welcome')
                            ->label('Send welcome email to new subscribers'),
                    ])
                    ->columns(1),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();
        MailSettings::save($data);
        MailSettings::apply();

        $this->form->fill(MailSettings::all());

        Notification::make()
            ->success()
            ->title('Mail settings saved')
            ->send();
    }

    public function sendTestEmail(): void
    {
        $data = $this->form->getState();
        MailSettings::save($data);
        MailSettings::apply();

        $to = $data['mail_admin_to'] ?? MailSettings::adminTo();

        if (! filled($to)) {
            Notification::make()
                ->warning()
                ->title('Set admin inbox email first')
                ->send();

            return;
        }

        if (! MailSettings::isConfigured()) {
            Notification::make()
                ->danger()
                ->title('SMTP not configured')
                ->body('Enable SMTP, Gmail address, and app password.')
                ->send();

            return;
        }

        try {
            Mail::to($to)->send(new TestMail);

            Notification::make()
                ->success()
                ->title('Test email sent')
                ->body("Check {$to} — including spam/promotions if you do not see it in inbox.")
                ->send();
        } catch (\Throwable $e) {
            Notification::make()
                ->danger()
                ->title('Send failed')
                ->body($e->getMessage())
                ->send();
        }
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save mail settings')
                ->submit('save')
                ->keyBindings(['mod+s']),
            Action::make('sendTest')
                ->label('Send test email')
                ->icon(Heroicon::OutlinedPaperAirplane)
                ->color('gray')
                ->action('sendTestEmail'),
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
        return static::$title ?? 'Email & Gmail SMTP';
    }
}
