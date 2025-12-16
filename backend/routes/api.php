<?php

use App\Http\Controllers\AuthController;
use Fruitcake\Cors\HandleCors;
use Illuminate\Support\Facades\Route;

// Respond to CORS preflight requests so the browser receives the expected
// Access-Control-Allow-* headers even before authentication happens.
Route::options('/{any}', function () {
    return response()->noContent();
})->where('any', '.*');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
