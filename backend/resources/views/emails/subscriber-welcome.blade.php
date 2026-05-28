@php
    $settings = \App\Support\SiteContent::settingsPayload();
    $siteName = $settings['name'] ?? 'PixelNoryx';
    $frontend = rtrim((string) \App\Models\SiteSetting::get('seo_site_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');
@endphp
<x-mail::message>
# Welcome{{ $subscriber->name ? ', '.$subscriber->name : '' }}!

You're subscribed to **{{ $siteName }}** — our weekly developer newsletter on React, Laravel, SaaS, and shipping products.

We'll send new issues to **{{ $subscriber->email }}**. You can unsubscribe anytime from any email.

<x-mail::button :url="$frontend.'/archive'">
Browse the archive
</x-mail::button>

Thanks for reading,<br>
{{ $siteName }}
</x-mail::message>
