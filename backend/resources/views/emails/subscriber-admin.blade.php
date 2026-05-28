<x-mail::message>
# New newsletter subscriber

**Email:** {{ $subscriber->email }}  
@if($subscriber->name)
**Name:** {{ $subscriber->name }}  
@endif
**Source:** {{ $subscriber->source }}

<x-mail::button :url="config('app.url').'/admin/subscribers'">
View subscribers
</x-mail::button>

</x-mail::message>
