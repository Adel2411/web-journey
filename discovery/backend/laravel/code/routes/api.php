<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::put('/updatetask/{id}', [TaskController::class, 'update']);
Route::get('/task/{id}', [TaskController::class, 'show']);
//Route::get('/tasks', [TaskController::class, 'index']);
Route::delete('/task/{id}', [TaskController::class, 'destroy']);
Route::post('/addtask', [TaskController::class, 'store']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'isuserwail'])->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
});
