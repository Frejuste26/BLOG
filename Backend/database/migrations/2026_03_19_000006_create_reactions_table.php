<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('reactable'); // post ou commentaire
            $table->enum('type', ['like', 'amour', 'bravo', 'drole', 'triste'])->default('like');
            $table->timestamps();

            // Un seul type de réaction par user par ressource
            $table->unique(['user_id', 'reactable_id', 'reactable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reactions');
    }
};
