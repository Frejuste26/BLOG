<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Commentaire extends Model
{
    use SoftDeletes;

    protected $fillable = ['post_id', 'user_id', 'parent_id', 'contenu'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Réponses imbriquées
    public function reponses(): HasMany
    {
        return $this->hasMany(Commentaire::class, 'parent_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Commentaire::class, 'parent_id');
    }

    public function reactions(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }
}
