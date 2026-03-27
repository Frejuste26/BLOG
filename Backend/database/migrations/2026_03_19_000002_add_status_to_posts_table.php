<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('statut', ['brouillon', 'publie'])->default('brouillon')->after('description');
            $table->string('image')->nullable()->after('statut');
            $table->string('slug')->unique()->after('titre');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['statut', 'image', 'slug']);
        });
    }
};
