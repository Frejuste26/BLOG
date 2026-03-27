<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Categorie extends Model
{
    protected $fillable = ['nom', 'slug', 'description'];

    protected static function booted(): void
    {
        static::creating(fn(Categorie $c) => $c->slug = Str::slug($c->nom));
        static::updating(fn(Categorie $c) => $c->slug = Str::slug($c->nom));
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'categorie_post');
    }
}
