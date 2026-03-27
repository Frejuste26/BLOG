<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdatePostStatusRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'statut' => ['required', Rule::in(['brouillon', 'publie'])],
        ];
    }

    public function messages(): array
    {
        return [
            'statut.required' => 'Le statut est requis.',
            'statut.in'       => 'Le statut doit être "brouillon" ou "publie".',
        ];
    }
}
