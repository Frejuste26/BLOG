<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class CreatePostRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'titre'        => ['required', 'string', 'min:3', 'max:255'],
            'description'  => ['required', 'string', 'min:10', 'max:5000'],
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
            'titre.required'        => 'Un titre doit être fourni.',
            'titre.min'             => 'Le titre doit contenir au moins :min caractères.',
            'titre.max'             => 'Le titre ne peut pas dépasser :max caractères.',
            'description.required'  => 'Une description est requise.',
            'description.min'       => 'La description doit contenir au moins :min caractères.',
            'statut.in'             => 'Le statut doit être "brouillon" ou "publie".',
            'categories.array'      => 'Les catégories doivent être un tableau.',
            'categories.*.exists'   => 'Une ou plusieurs catégories sont invalides.',
            'tags.array'            => 'Les tags doivent être un tableau.',
            'tags.*.exists'         => 'Un ou plusieurs tags sont invalides.',
        ];
    }
}
