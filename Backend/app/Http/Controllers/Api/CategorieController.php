<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Requests\CreateCategorieRequest;
use App\Http\Requests\EditCategorieRequest;
use App\Models\Categorie;

class CategorieController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Categorie::withCount('posts')->orderBy('nom')->get();

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    public function store(CreateCategorieRequest $request): JsonResponse
    {
        $this->authorize('create', Categorie::class);

        $categorie = Categorie::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès.',
            'data'    => $categorie,
        ], Response::HTTP_CREATED);
    }

    public function update(EditCategorieRequest $request, Categorie $categorie): JsonResponse
    {
        $this->authorize('update', Categorie::class);

        $categorie->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès.',
            'data'    => $categorie,
        ]);
    }

    public function destroy(Categorie $categorie): JsonResponse
    {
        $this->authorize('delete', Categorie::class);

        $categorie->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès.',
        ]);
    }
}
