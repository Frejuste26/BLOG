<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Requests\CreateTagRequest;
use App\Models\Tag;
use App\Models\Categorie;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        $tags = Tag::withCount('posts')->orderBy('nom')->get();

        return response()->json([
            'success' => true,
            'data'    => $tags,
        ]);
    }

    public function store(CreateTagRequest $request): JsonResponse
    {
        $this->authorize('create', Categorie::class); // Même droit que catégorie : admin only

        $tag = Tag::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Tag créé avec succès.',
            'data'    => $tag,
        ], Response::HTTP_CREATED);
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $this->authorize('create', Categorie::class);

        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tag supprimé avec succès.',
        ]);
    }
}
