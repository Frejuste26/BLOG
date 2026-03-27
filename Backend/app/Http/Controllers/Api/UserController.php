<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUser;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function register(RegisterUser $request)
    {
        try {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->save();

            Auth::login($user);
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur enregistre avec succes',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (Exception $e) {
            Log::error('Erreur inscription', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(LoginUserRequest $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Informations non valides',
                ], 401);
            }

            /** @var \App\Models\User $user */
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion reussie',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (Exception $e) {
            Log::error('Erreur connexion', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            if ($request->user()) {
                $request->user()->tokens()->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Deconnexion reussie',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la deconnexion: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        try {
            /** @var \App\Models\User $user */
            $user = $request->user();

            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil mis a jour avec succes',
                'user' => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise a jour du profil: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        try {
            /** @var \App\Models\User $user */
            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le mot de passe actuel est incorrect',
                ], 422);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe mis a jour avec succes',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise a jour du mot de passe: ' . $e->getMessage(),
            ], 500);
        }
    }
}
