<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users,email',
            'password' => 'required'
        ];
    }

    public function failedValidation(Validator $validator){
        throw new HttpResponseException(response()->json([
            'success' => false,
            'status_code' => 422,
            'message' => 'Erreur de validation',
            'errorsList' => $validator->errors()
        ]));
    }

    public function messages()
    {
        return [
            'email.required' => 'Une adresse email doit être fourni',
            'email.email' => "Cette adresse email n'est pas valide",
            'email.exists' => "Cette adresse email existe deja",
            'password.required' => 'Le mot de passe est requis'
        ];
    }
}
