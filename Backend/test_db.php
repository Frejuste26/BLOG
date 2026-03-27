<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "Connexion DB : OK\n";
} catch (\Exception $e) {
    echo "Erreur DB : " . $e->getMessage() . "\n";
}
