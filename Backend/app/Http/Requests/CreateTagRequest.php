<?php

namespace App\Http\Requests;

class CreateTagRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'min:2', 'max:50', 'unique:tags,nom'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom du tag est requis.',
            'nom.unique'   => 'Ce tag existe déjà.',
            'nom.min'      => 'Le nom du tag doit contenir au moins :min caractères.',
            'nom.max'      => 'Le nom du tag ne peut pas dépasser :max caractères.',
        ];
    }
}
