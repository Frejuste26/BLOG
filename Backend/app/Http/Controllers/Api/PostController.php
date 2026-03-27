<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\EditPostRequest;
use App\Http\Requests\UpdatePostStatusRequest;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 10);
        $search  = $request->string('search')->trim()->value();
        $user    = $request->user();

        $posts = Post::query()
            ->with(['user:id,name,avatar', 'categories:id,nom', 'tags:id,nom'])
            ->withCount(['commentaires', 'reactions'])
            ->visiblePour($user)
            ->when($search, fn($q) => $q->where('titre', 'LIKE', "%{$search}%"))
            ->when($request->categorie, fn($q, $cat) =>
                $q->whereHas('categories', fn($q2) => $q2->where('slug', $cat))
            )
            ->when($request->tag, fn($q, $tag) =>
                $q->whereHas('tags', fn($q2) => $q2->where('slug', $tag))
            )
            ->orderByDesc('created_at')
            ->paginate(min($perPage, 100));

        return response()->json([
            'success' => true,
            'message' => 'Posts récupérés avec succès.',
            'data'    => $posts->items(),
            'meta'    => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'per_page'     => $posts->perPage(),
                'total'        => $posts->total(),
            ],
        ]);
    }

    public function show(Post $post): JsonResponse
    {
        $this->authorize('view', $post);

        $post->load(['user:id,name,avatar', 'categories:id,nom,slug', 'tags:id,nom,slug']);
        $post->loadCount(['commentaires', 'reactions']);

        return response()->json([
            'success' => true,
            'data'    => $post,
        ]);
    }

    public function store(CreatePostRequest $request): JsonResponse
    {
        $this->authorize('create', Post::class);

        $data            = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['statut']  = $data['statut'] ?? 'brouillon';

        // Seul l'admin peut publier directement
        if ($data['statut'] === 'publie' && !$request->user()->isAdmin()) {
            $data['statut'] = 'brouillon';
        }

        $post = Post::create($data);
        $post->categories()->sync($data['categories'] ?? []);
        $post->tags()->sync($data['tags'] ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Post créé avec succès.',
            'data'    => $post->load(['categories:id,nom', 'tags:id,nom']),
        ], Response::HTTP_CREATED);
    }

    public function update(EditPostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        $data = $request->validated();
        $post->update($data);
        $post->categories()->sync($data['categories'] ?? $post->categories->pluck('id'));
        $post->tags()->sync($data['tags'] ?? $post->tags->pluck('id'));

        return response()->json([
            'success' => true,
            'message' => 'Post mis à jour avec succès.',
            'data'    => $post->load(['categories:id,nom', 'tags:id,nom']),
        ]);
    }

    public function updateStatus(UpdatePostStatusRequest $request, Post $post): JsonResponse
    {
        $this->authorize('publish', $post);

        $post->update(['statut' => $request->validated('statut')]);

        return response()->json([
            'success' => true,
            'message' => 'Statut du post mis à jour.',
            'data'    => $post,
        ]);
    }

    public function delete(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);

        // Suppression de l'image associée si elle existe
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post supprimé avec succès.',
        ]);
    }
}
