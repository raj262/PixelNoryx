<x-filament-panels::page>
    @if (! $configured)
        <x-filament::section>
            <x-slot name="heading">Connect Google Analytics</x-slot>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                Your site already tracks visitors with
                <strong>{{ config('analytics.measurement_id') }}</strong> on the frontend.
                To show reports here, connect the <strong>GA4 Data API</strong> (one-time setup).
            </p>
            <ol class="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li>
                    In
                    <a href="https://analytics.google.com/" target="_blank" rel="noopener" class="text-primary-600 underline">Google Analytics</a>,
                    open <strong>Admin → Property Settings</strong> and copy the numeric
                    <strong>Property ID</strong> (not <code>G-…</code>).
                </li>
                <li>
                    In
                    <a href="https://console.cloud.google.com/" target="_blank" rel="noopener" class="text-primary-600 underline">Google Cloud Console</a>,
                    create a project → enable <strong>Google Analytics Data API</strong> →
                    create a <strong>Service Account</strong> → download JSON key.
                </li>
                <li>
                    In GA4: <strong>Admin → Property access management</strong> → add the service account email as
                    <strong>Viewer</strong>.
                </li>
                <li>
                    Save the JSON file to
                    <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">backend/storage/app/analytics/service-account.json</code>
                </li>
                <li>
                    Add to <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">backend/.env</code>:
                    <pre class="mt-2 overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs text-gray-100">GA4_PROPERTY_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/storage/app/analytics/service-account.json</pre>
                </li>
                <li>Run <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">php artisan config:clear</code> and refresh this page.</li>
            </ol>
        </x-filament::section>
    @elseif ($error)
        <x-filament::section>
            <x-slot name="heading">Could not load analytics</x-slot>
            <p class="text-sm text-danger-600">{{ $error }}</p>
            <p class="mt-2 text-xs text-gray-500">Check Property ID, service account access, and that the JSON key path is correct.</p>
        </x-filament::section>
    @else
        @php
            $maxSessions = count($daily) > 0 ? max(1, ...array_column($daily, 'sessions')) : 1;
            $durationMin = floor(($overview['avgSessionDuration'] ?? 0) / 60);
            $durationSec = (int) (($overview['avgSessionDuration'] ?? 0) % 60);
        @endphp

        <p class="mb-4 text-sm text-gray-500">Last {{ $days }} days · Measurement ID {{ config('analytics.measurement_id') }}</p>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            @foreach ([
                ['label' => 'Active users', 'value' => number_format($overview['activeUsers'] ?? 0)],
                ['label' => 'Sessions', 'value' => number_format($overview['sessions'] ?? 0)],
                ['label' => 'Page views', 'value' => number_format($overview['pageViews'] ?? 0)],
                ['label' => 'New users', 'value' => number_format($overview['newUsers'] ?? 0)],
                ['label' => 'Avg. session', 'value' => sprintf('%d:%02d', $durationMin, $durationSec)],
            ] as $stat)
                <x-filament::section class="!p-4">
                    <p class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ $stat['label'] }}</p>
                    <p class="mt-1 text-2xl font-bold text-gray-950 dark:text-white">{{ $stat['value'] }}</p>
                </x-filament::section>
            @endforeach
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <x-filament::section>
                <x-slot name="heading">Sessions over time</x-slot>
                @if (count($daily) === 0)
                    <p class="text-sm text-gray-500">No data for this period.</p>
                @else
                    <div class="flex h-48 items-end gap-0.5">
                        @foreach ($daily as $point)
                            @php $height = max(4, (int) round(($point['sessions'] / $maxSessions) * 100)); @endphp
                            <div
                                class="group relative min-w-0 flex-1 rounded-t bg-primary-500/80 hover:bg-primary-500"
                                style="height: {{ $height }}%"
                                title="{{ $point['date'] }}: {{ $point['sessions'] }} sessions"
                            ></div>
                        @endforeach
                    </div>
                    <div class="mt-2 flex justify-between text-[10px] text-gray-400">
                        <span>{{ $daily[0]['date'] ?? '' }}</span>
                        <span>{{ $daily[array_key_last($daily)]['date'] ?? '' }}</span>
                    </div>
                @endif
            </x-filament::section>

            <x-filament::section>
                <x-slot name="heading">Top pages</x-slot>
                @if (count($topPages) === 0)
                    <p class="text-sm text-gray-500">No page data yet.</p>
                @else
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-gray-200 text-xs uppercase text-gray-500">
                                    <th class="pb-2 pr-4">Page</th>
                                    <th class="pb-2 text-right">Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($topPages as $page)
                                    <tr class="border-b border-gray-100 dark:border-gray-800">
                                        <td class="max-w-xs truncate py-2 pr-4 font-mono text-xs">{{ $page['path'] }}</td>
                                        <td class="py-2 text-right font-semibold">{{ number_format($page['views']) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </x-filament::section>
        </div>

        <x-filament::section class="mt-6">
            <x-slot name="heading">Full Google Analytics report</x-slot>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                For the complete GA4 experience (real-time, explorations, conversions, demographics), use the official dashboard.
            </p>
            <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
            >
                Open analytics.google.com →
            </a>
        </x-filament::section>
    @endif
</x-filament-panels::page>
