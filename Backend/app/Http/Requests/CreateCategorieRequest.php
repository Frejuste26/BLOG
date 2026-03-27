<?php

namespace App\Http\Requests;

class CreateCategorieRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'nom'         => ['required', 'string', 'min:2', 'max:100', 'unique:categories,nom'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom de la catégorie est requis.',
            'nom.unique'   => 'Cette catégorie existe déjà.',
            'nom.min'      => 'Le nom doit contenir au moins :min caractères.',
            'nom.max'      => 'Le nom ne peut pas dépasser :max caractères.',
        ];
    }
}
