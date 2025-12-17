<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Fruitcake\Cors\HandleCors;


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

    Route::get('/buildings', [BuildingController::class, 'index']);
    Route::post('/buildings', [BuildingController::class, 'store']);
    Route::get('/buildings/{id}', [BuildingController::class, 'show']);
    Route::put('/buildings/{id}', [BuildingController::class, 'update']);
    Route::delete('/buildings/{id}', [BuildingController::class, 'destroy']);

    Route::get('/buildings/{building}/units', [UnitController::class, 'index']);
    Route::post('/buildings/{building}/units', [UnitController::class, 'store']);
    Route::put('/units/{unit}', [UnitController::class, 'update']);
    Route::delete('/units/{unit}', [UnitController::class, 'destroy']);
});
