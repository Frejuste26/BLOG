<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\ReactionRequest;
use App\Models\Reaction;
use App\Models\Post;
use App\Models\Commentaire;

class ReactionController extends Controller
{
    public function toggle(ReactionRequest $request): JsonResponse
    {
        $user          = $request->user();
        $reactableType = $request->validated('reactable_type') === 'post'
            ? Post::class
            : Commentaire::class;
        $reactableId   = $request->validated('reactable_id');
        $type          = $request->validated('type');

        $existing = Reaction::where([
            'user_id'        => $user->id,
            'reactable_type' => $reactableType,
            'reactable_id'   => $reactableId,
        ])->first();

        // Même type → retrait (toggle)
        if ($existing && $existing->type === $type) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'message' => 'Réaction retirée.',
                'data'    => ['action' => 'removed'],
            ]);
        }

        // Autre type → mise à jour, pas de doublon
        $reaction = Reaction::updateOrCreate(
            ['user_id' => $user->id, 'reactable_type' => $reactableType, 'reactable_id' => $reactableId],
            ['type'    => $type]
        );

        return response()->json([
            'success' => true,
            'message' => 'Réaction enregistrée.',
            'data'    => ['action' => 'added', 'reaction' => $reaction],
        ]);
    }

    public function index(string $type, int $id): JsonResponse
    {
        $reactableType = $type === 'post' ? Post::class : Commentaire::class;

        $reactions = Reaction::where('reactable_type', $reactableType)
            ->where('reactable_id', $id)
            ->selectRaw('type, COUNT(*) as total')
            ->groupBy('type')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $reactions,
        ]);
    }
}
