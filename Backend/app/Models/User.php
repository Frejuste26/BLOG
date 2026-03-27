<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'avatar', 'bio'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Rôles
    public function isAdmin(): bool   { return $this->role === 'admin'; }
    public function isAuteur(): bool  { return $this->role === 'auteur'; }
    public function isLecteur(): bool { return $this->role === 'lecteur'; }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function commentaires(): HasMany
    {
        return $this->hasMany(Commentaire::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }
}
