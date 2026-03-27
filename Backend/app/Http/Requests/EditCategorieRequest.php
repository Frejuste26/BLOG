<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class EditCategorieRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'nom'         => [
                'sometimes', 'required', 'string', 'min:2', 'max:100',
                Rule::unique('categories', 'nom')->ignore($this->route('categorie')),
            ],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom de la catégorie est requis.',
            'nom.unique'   => 'Cette catégorie existe déjà.',
            'nom.min'      => 'Le nom doit contenir au moins :min caractères.',
        ];
    }
}
