<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class EditPostRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'titre'        => ['sometimes', 'required', 'string', 'min:3', 'max:255'],
            'description'  => ['sometimes', 'required', 'string', 'min:10', 'max:5000'],
            'statut'       => ['sometimes', Rule::in(['brouillon', 'publie'])],
            'categories'   => ['nullable', 'array'],
            'categories.*' => ['integer', 'exists:categories,id'],
            'tags'         => ['nullable', 'array'],
            'tags.*'       => ['integer', 'exists:tags,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'titre.min'           => 'Le titre doit contenir au moins :min caractères.',
            'description.min'     => 'La description doit contenir au moins :min caractères.',
            'statut.in'           => 'Le statut doit être "brouillon" ou "publie".',
            'categories.array'    => 'Les catégories doivent être un tableau.',
            'categories.*.exists' => 'Une ou plusieurs catégories sont invalides.',
            'tags.array'          => 'Les tags doivent être un tableau.',
            'tags.*.exists'       => 'Un ou plusieurs tags sont invalides.',
        ];
    }
}
