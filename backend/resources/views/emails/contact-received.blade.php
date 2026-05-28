<x-mail::message>
# New contact message

**From:** {{ $contactMessage->name }}  
**Email:** {{ $contactMessage->email }}

---

{{ $contactMessage->message }}

<x-mail::button :url="config('app.url').'/admin/contact-messages'">
View in admin
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
