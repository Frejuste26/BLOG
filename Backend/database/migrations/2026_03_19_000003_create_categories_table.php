<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Pivot post <-> categorie
        Schema::create('categorie_post', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('categorie_id')->constrained('categories')->cascadeOnDelete();
            $table->primary(['post_id', 'categorie_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorie_post');
        Schema::dropIfExists('categories');
    }
};
