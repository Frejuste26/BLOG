<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ReactionRequest extends BasePostRequest
{
    public function rules(): array
    {
        return [
            'type'           => ['required', Rule::in(['like', 'amour', 'bravo', 'drole', 'triste'])],
            'reactable_type' => ['required', Rule::in(['post', 'commentaire'])],
            'reactable_id'   => ['required', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required'           => 'Le type de réaction est requis.',
            'type.in'                 => 'Le type de réaction est invalide.',
            'reactable_type.required' => 'Le type de ressource est requis.',
            'reactable_type.in'       => 'Le type de ressource doit être "post" ou "commentaire".',
            'reactable_id.required'   => "L'identifiant de la ressource est requis.",
            'reactable_id.integer'    => "L'identifiant doit être un entier.",
        ];
    }
}
