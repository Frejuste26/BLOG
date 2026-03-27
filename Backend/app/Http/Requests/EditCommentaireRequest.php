<?php

namespace App\Http\Requests;

class EditCommentaireRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'contenu' => ['required', 'string', 'min:2', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'contenu.required' => 'Le contenu du commentaire est requis.',
            'contenu.min'      => 'Le commentaire doit contenir au moins :min caractères.',
            'contenu.max'      => 'Le commentaire ne peut pas dépasser :max caractères.',
        ];
    }
}
