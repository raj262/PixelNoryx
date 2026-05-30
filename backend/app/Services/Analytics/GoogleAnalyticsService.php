<?php

namespace App\Services\Analytics;

use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;
use Google\Analytics\Data\V1beta\OrderBy;
use Google\Analytics\Data\V1beta\OrderBy\MetricOrderBy;
use Google\Analytics\Data\V1beta\RunReportRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsService
{
    public function isConfigured(): bool
    {
        $propertyId = config('analytics.property_id');
        $credentials = config('analytics.credentials');

        return filled($propertyId)
            && is_string($credentials)
            && $credentials !== ''
            && is_file($credentials);
    }

    /**
     * @return array{activeUsers: int, sessions: int, pageViews: int, newUsers: int, avgSessionDuration: float}
     */
    public function overview(int $days = 28): array
    {
        return Cache::remember("ga_overview_{$days}", config('analytics.cache_ttl'), function () use ($days) {
            $response = $this->client()->runReport(new RunReportRequest([
                'property' => $this->property(),
                'date_ranges' => [
                    new DateRange([
                        'start_date' => "{$days}daysAgo",
                        'end_date' => 'today',
                    ]),
                ],
                'metrics' => [
                    new Metric(['name' => 'activeUsers']),
                    new Metric(['name' => 'sessions']),
                    new Metric(['name' => 'screenPageViews']),
                    new Metric(['name' => 'newUsers']),
                    new Metric(['name' => 'averageSessionDuration']),
                ],
            ]));

            $row = $response->getRows()[0] ?? null;
            if (! $row) {
                return $this->emptyOverview();
            }

            $values = $row->getMetricValues();

            return [
                'activeUsers' => (int) ($values[0]?->getValue() ?? 0),
                'sessions' => (int) ($values[1]?->getValue() ?? 0),
                'pageViews' => (int) ($values[2]?->getValue() ?? 0),
                'newUsers' => (int) ($values[3]?->getValue() ?? 0),
                'avgSessionDuration' => round((float) ($values[4]?->getValue() ?? 0), 1),
            ];
        });
    }

    /**
     * @return list<array{date: string, sessions: int}>
     */
    public function dailySessions(int $days = 28): array
    {
        return Cache::remember("ga_daily_{$days}", config('analytics.cache_ttl'), function () use ($days) {
            $response = $this->client()->runReport(new RunReportRequest([
                'property' => $this->property(),
                'date_ranges' => [
                    new DateRange([
                        'start_date' => "{$days}daysAgo",
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [new Dimension(['name' => 'date'])],
                'metrics' => [new Metric(['name' => 'sessions'])],
                'order_bys' => [
                    new OrderBy([
                        'dimension' => new OrderBy\DimensionOrderBy(['dimension_name' => 'date']),
                    ]),
                ],
            ]));

            $out = [];
            foreach ($response->getRows() as $row) {
                $dateRaw = $row->getDimensionValues()[0]?->getValue() ?? '';
                $sessions = (int) ($row->getMetricValues()[0]?->getValue() ?? 0);
                if ($dateRaw !== '') {
                    $out[] = [
                        'date' => substr($dateRaw, 0, 4).'-'.substr($dateRaw, 4, 2).'-'.substr($dateRaw, 6, 2),
                        'sessions' => $sessions,
                    ];
                }
            }

            return $out;
        });
    }

    /**
     * @return list<array{path: string, views: int}>
     */
    public function topPages(int $limit = 10, int $days = 28): array
    {
        return Cache::remember("ga_top_pages_{$limit}_{$days}", config('analytics.cache_ttl'), function () use ($limit, $days) {
            $response = $this->client()->runReport(new RunReportRequest([
                'property' => $this->property(),
                'date_ranges' => [
                    new DateRange([
                        'start_date' => "{$days}daysAgo",
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [new Dimension(['name' => 'pagePath'])],
                'metrics' => [new Metric(['name' => 'screenPageViews'])],
                'order_bys' => [
                    new OrderBy([
                        'metric' => new MetricOrderBy([
                            'metric_name' => 'screenPageViews',
                        ]),
                        'desc' => true,
                    ]),
                ],
                'limit' => $limit,
            ]));

            $out = [];
            foreach ($response->getRows() as $row) {
                $out[] = [
                    'path' => $row->getDimensionValues()[0]?->getValue() ?? '/',
                    'views' => (int) ($row->getMetricValues()[0]?->getValue() ?? 0),
                ];
            }

            return $out;
        });
    }

    public function clearCache(): void
    {
        foreach ([7, 28, 30] as $days) {
            Cache::forget("ga_overview_{$days}");
            Cache::forget("ga_daily_{$days}");
            Cache::forget("ga_top_pages_10_{$days}");
        }
    }

    private function client(): BetaAnalyticsDataClient
    {
        try {
            return new BetaAnalyticsDataClient([
                'credentials' => config('analytics.credentials'),
            ]);
        } catch (\Throwable $e) {
            Log::error('GA4 client error: '.$e->getMessage());
            throw $e;
        }
    }

    private function property(): string
    {
        return 'properties/'.config('analytics.property_id');
    }

    /**
     * @return array{activeUsers: int, sessions: int, pageViews: int, newUsers: int, avgSessionDuration: float}
     */
    private function emptyOverview(): array
    {
        return [
            'activeUsers' => 0,
            'sessions' => 0,
            'pageViews' => 0,
            'newUsers' => 0,
            'avgSessionDuration' => 0.0,
        ];
    }
}
