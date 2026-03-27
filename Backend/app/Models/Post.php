<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['titre', 'slug', 'description', 'statut', 'image', 'user_id'];

    protected static function booted(): void
    {
        // Génération automatique du slug à la création
        static::creating(function (Post $post) {
            $post->slug = Str::slug($post->titre) . '-' . Str::random(6);
        });
    }

    // Scopes de visibilité
    public function scopePublie($query)
    {
        return $query->where('statut', 'publie');
    }

    public function scopeVisiblePour($query, ?User $user)
    {
        if ($user && $user->isAdmin()) {
            return $query; // Tout voir
        }

        if ($user && $user->isAuteur()) {
            // Ses brouillons + tous les publiés
            return $query->where(function ($q) use ($user) {
                $q->where('statut', 'publie')
                  ->orWhere(fn($q2) => $q2->where('statut', 'brouillon')->where('user_id', $user->id));
            });
        }

        // Lecteur ou invité : uniquement les publiés
        return $query->where('statut', 'publie');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Categorie::class, 'categorie_post');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tag');
    }

    public function commentaires(): HasMany
    {
        return $this->hasMany(Commentaire::class);
    }

    public function reactions(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }
}
