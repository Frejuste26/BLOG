<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Requests\CreateCommentaireRequest;
use App\Http\Requests\EditCommentaireRequest;
use App\Models\Commentaire;
use App\Models\Post;

class CommentaireController extends Controller
{
    public function index(Post $post): JsonResponse
    {
        $commentaires = $post->commentaires()
            ->with(['user:id,name,avatar', 'reponses.user:id,name,avatar'])
            ->whereNull('parent_id')
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Commentaires récupérés avec succès.',
            'data'    => $commentaires->items(),
            'meta'    => [
                'current_page' => $commentaires->currentPage(),
                'last_page'    => $commentaires->lastPage(),
                'total'        => $commentaires->total(),
            ],
        ]);
    }

    public function store(CreateCommentaireRequest $request, Post $post): JsonResponse
    {
        $this->authorize('create', Commentaire::class);

        // Vérifier que le post est publié (ou que l'user est admin/auteur propriétaire)
        if ($post->statut !== 'publie' && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de commenter un post non publié.',
            ], Response::HTTP_FORBIDDEN);
        }

        $commentaire = Commentaire::create([
            'post_id'   => $post->id,
            'user_id'   => $request->user()->id,
            'parent_id' => $request->validated('parent_id'),
            'contenu'   => $request->validated('contenu'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commentaire ajouté avec succès.',
            'data'    => $commentaire->load('user:id,name,avatar'),
        ], Response::HTTP_CREATED);
    }

    public function update(EditCommentaireRequest $request, Commentaire $commentaire): JsonResponse
    {
        $this->authorize('update', $commentaire);

        $commentaire->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Commentaire mis à jour avec succès.',
            'data'    => $commentaire,
        ]);
    }

    public function destroy(Commentaire $commentaire): JsonResponse
    {
        $this->authorize('delete', $commentaire);

        $commentaire->delete(); // SoftDelete

        return response()->json([
            'success' => true,
            'message' => 'Commentaire supprimé avec succès.',
        ]);
    }
}
