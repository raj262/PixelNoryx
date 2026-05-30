<?php

namespace App\Filament\Pages;

use App\Services\Analytics\GoogleAnalyticsService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class AnalyticsDashboard extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChartBar;

    protected static string|UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?string $navigationLabel = 'Analytics';

    protected static ?int $navigationSort = 5;

    protected static ?string $title = 'Analytics Dashboard';

    protected static ?string $slug = 'analytics';

    protected string $view = 'filament.pages.analytics-dashboard';

    /** @var array<string, int|float> */
    public array $overview = [];

    /** @var list<array{date: string, sessions: int}> */
    public array $daily = [];

    /** @var list<array{path: string, views: int}> */
    public array $topPages = [];

    public bool $configured = false;

    public ?string $error = null;

    public int $days = 28;

    public static function canAccess(): bool
    {
        $user = auth()->user();

        return $user && ($user->hasRole('admin') || $user->can('settings.manage'));
    }

    public function mount(GoogleAnalyticsService $analytics): void
    {
        $this->loadData($analytics);
    }

    public function refreshAnalytics(GoogleAnalyticsService $analytics): void
    {
        $analytics->clearCache();
        $this->loadData($analytics);
        $this->dispatch('analytics-refreshed');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('refresh')
                ->label('Refresh data')
                ->icon('heroicon-o-arrow-path')
                ->action('refreshAnalytics'),
            Action::make('open_ga')
                ->label('Full report in Google')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->url('https://analytics.google.com/')
                ->openUrlInNewTab(),
        ];
    }

    private function loadData(GoogleAnalyticsService $analytics): void
    {
        $this->configured = $analytics->isConfigured();
        $this->error = null;
        $this->overview = [];
        $this->daily = [];
        $this->topPages = [];

        if (! $this->configured) {
            return;
        }

        try {
            $this->overview = $analytics->overview($this->days);
            $this->daily = $analytics->dailySessions($this->days);
            $this->topPages = $analytics->topPages(10, $this->days);
        } catch (\Throwable $e) {
            $this->error = $e->getMessage();
        }
    }
}
