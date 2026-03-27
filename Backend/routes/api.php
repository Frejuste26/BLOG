<?php

use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\CommentaireController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ReactionController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// ============================================================
// Routes PUBLIQUES (sans authentification)
// ============================================================

Route::prefix('auth')->group(function () {
    Route::post('register', [UserController::class, 'register']);
    Route::post('login',    [UserController::class, 'login']);
});

// Lecture publique des posts publiés
Route::get('posts',       [PostController::class, 'index']);
Route::get('posts/{post}', [PostController::class, 'show']);

// Lecture publique des catégories et tags
Route::get('categories',  [CategorieController::class, 'index']);
Route::get('tags',        [TagController::class, 'index']);

// Commentaires d'un post (lecture publique)
Route::get('posts/{post}/commentaires', [CommentaireController::class, 'index']);

// Réactions d'une ressource (lecture publique)
Route::get('reactions/{type}/{id}', [ReactionController::class, 'index']);


// ============================================================
// Routes AUTHENTIFIÉES
// ============================================================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('user', function (Illuminate\Http\Request $request) {
        return $request->user();
    });

    // Auth
    Route::post('logout', [UserController::class, 'logout']);

    // Profil utilisateur
    Route::prefix('user')->group(function () {
        Route::put('profile',  [UserController::class, 'updateProfile']);
        Route::put('password', [UserController::class, 'updatePassword']);
    });

    // Posts — création, modification, suppression, changement de statut
    Route::post('posts',               [PostController::class, 'store']);
    Route::put('posts/{post}',         [PostController::class, 'update']);
    Route::patch('posts/{post}/statut', [PostController::class, 'updateStatus']);
    Route::delete('posts/{post}',      [PostController::class, 'delete']);

    // Commentaires — création, modification, suppression
    Route::post('posts/{post}/commentaires',         [CommentaireController::class, 'store']);
    Route::put('commentaires/{commentaire}',         [CommentaireController::class, 'update']);
    Route::delete('commentaires/{commentaire}',      [CommentaireController::class, 'destroy']);

    // Réactions — toggle (like/unlike, changer de type)
    Route::post('reactions', [ReactionController::class, 'toggle']);

    // Images — upload et suppression
    Route::post('images',   [ImageController::class, 'upload']);
    Route::delete('images', [ImageController::class, 'delete']);


    // ============================================================
    // Routes ADMIN uniquement
    // ============================================================

    Route::middleware('role:admin')->group(function () {

        // Catégories
        Route::post('categories',             [CategorieController::class, 'store']);
        Route::put('categories/{categorie}',  [CategorieController::class, 'update']);
        Route::delete('categories/{categorie}', [CategorieController::class, 'destroy']);

        // Tags
        Route::post('tags',        [TagController::class, 'store']);
        Route::delete('tags/{tag}', [TagController::class, 'destroy']);
    });
});
