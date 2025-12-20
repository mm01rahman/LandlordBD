<?php

use Illuminate\Support\Facades\Route;
use Fruitcake\Cors\HandleCors;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\RentalAgreementController;
use App\Http\Controllers\PaymentController;

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

    Route::get('/tenants', [TenantController::class, 'index']);
    Route::post('/tenants', [TenantController::class, 'store']);
    Route::get('/tenants/{id}', [TenantController::class, 'show']);
    Route::put('/tenants/{id}', [TenantController::class, 'update']);
    Route::delete('/tenants/{id}', [TenantController::class, 'destroy']);

    Route::get('/agreements', [RentalAgreementController::class, 'index']);
    Route::post('/agreements', [RentalAgreementController::class, 'store']);
    Route::get('/agreements/{id}', [RentalAgreementController::class, 'show']);
    Route::put('/agreements/{id}', [RentalAgreementController::class, 'update']);
    Route::post('/agreements/{id}/end', [RentalAgreementController::class, 'end']);

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::put('/payments/{id}', [PaymentController::class, 'update']);
    Route::get('/outstanding', [PaymentController::class, 'outstanding']);
});
