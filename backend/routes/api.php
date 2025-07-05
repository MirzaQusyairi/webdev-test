<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [LoginController::class, 'logout']);

Route::middleware(['auth:sanctum', 'api'])->group(function () {
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', SaleController::class);
});
