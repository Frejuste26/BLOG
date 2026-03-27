<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\Commentaire;
use App\Models\Categorie;
use App\Policies\PostPolicy;
use App\Policies\CommentairePolicy;
use App\Policies\CategoriePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Post::class        => PostPolicy::class,
        Commentaire::class => CommentairePolicy::class,
        Categorie::class   => CategoriePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
