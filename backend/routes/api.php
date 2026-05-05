<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\HouseAssignmentController;
use App\Http\Controllers\Api\DueController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ReportController;

use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('residents', ResidentController::class);
    Route::apiResource('houses', HouseController::class);
    Route::post('/assign-house', [HouseAssignmentController::class, 'assign']);
    Route::apiResource('dues', DueController::class);
    Route::post('/pay', [PaymentController::class, 'pay']);
    Route::apiResource('expenses', ExpenseController::class);

    Route::get('/reports/yearly/{year}', [ReportController::class, 'yearlyReport']);
    Route::get('/reports/monthly-detail/{year}/{month}', [ReportController::class, 'monthlyDetail']);
});