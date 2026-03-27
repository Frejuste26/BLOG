<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    $user = User::updateOrCreate(
        ['email' => 'admin@blog.com'],
        [
            'name' => 'Administrateur',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]
    );
    echo "Utilisateur Admin créé avec succès : admin@blog.com / password\n";
} catch (\Exception $e) {
    echo "Erreur lors de la création de l'admin : " . $e->getMessage() . "\n";
}
