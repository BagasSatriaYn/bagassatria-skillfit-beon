<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\HouseAssignmentController;
use App\Http\Controllers\Api\DueController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::apiResource('residents', ResidentController::class);
Route::apiResource('houses', HouseController::class);
Route::post('/assign-house', [HouseAssignmentController::class, 'assign']);
Route::apiResource('dues', DueController::class);
Route::post('/pay', [PaymentController::class, 'pay']);