<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Http\Requests\UploadImageRequest;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(UploadImageRequest $request): JsonResponse
    {
        $path = $request->file('image')->store('posts', 'public');

        return response()->json([
            'success' => true,
            'message' => 'Image uploadée avec succès.',
            'data'    => [
                'path' => $path,
                'url'  => Storage::url($path),
            ],
        ], Response::HTTP_CREATED);
    }

    public function delete(Request $request): JsonResponse
    {
        $path = $request->input('path');

        if (!$path || !Storage::disk('public')->exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Image introuvable.',
            ], Response::HTTP_NOT_FOUND);
        }

        Storage::disk('public')->delete($path);

        return response()->json([
            'success' => true,
            'message' => 'Image supprimée avec succès.',
        ]);
    }
}
