<?php

namespace App\Http\Requests;

class UploadImageRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => "L'image est requise.",
            'image.image'    => 'Le fichier doit être une image.',
            'image.mimes'    => 'Les formats acceptés sont : jpeg, png, webp.',
            'image.max'      => "L'image ne peut pas dépasser 2 Mo.",
        ];
    }
}
