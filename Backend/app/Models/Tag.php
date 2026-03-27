<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Tag extends Model
{
    protected $fillable = ['nom', 'slug'];

    protected static function booted(): void
    {
        static::creating(fn(Tag $t) => $t->slug = Str::slug($t->nom));
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_tag');
    }
}
