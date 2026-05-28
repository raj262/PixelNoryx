<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AiGenerateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['post_draft', 'faq', 'ad_copy', 'seo'])],
            'prompt' => ['required', 'string', 'max:4000'],
            'context' => ['sometimes', 'array'],
        ];
    }
}
