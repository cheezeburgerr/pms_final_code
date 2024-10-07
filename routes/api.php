<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\APIController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SizeChartController;
use App\Models\Equipment;
use App\Models\Notification;
use App\Models\ProductionDetails;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use carbon\Carbon;
use Illuminate\Support\Facades\Broadcast;

Route::get('printers', function () {return Equipment::where('type', 'Printer')->where('status', 'online')->get();})->name('get.printers');




Route::get('users', [OrderController::class, 'order']);
Route::get('users/{id}', [OrderController::class, 'show']);
Route::post('addnew', [OrderController::class, 'store']);
Route::put('usersupdate/{id}', [OrderController::class, 'update']);
Route::delete('usersdelete/{id}', [OrderController::class, 'destroy']);

Route::get('/order_details/{id}', [OrderController::class, 'get_details']);
Route::get('/edit_lineup/{id}', [OrderController::class, 'edit_lineup']);
Route::get('/get-lineup/{id}', [APIController::class, 'get_lineup']);
Route::get('/get-teams/{id}', [APIController::class, 'get_teams']);
Route::get('/edit_order/{id}', [OrderController::class, 'edit_order']);
Route::put('/update-player/{id}', [OrderController::class, 'update_player']);
Route::delete('/delete-player/{id}', [OrderController::class, 'delete_player']);
Route::post('/order/update/{id}', [OrderController::class, 'update_order']);

Route::get('/get-orders', [APIController::class, 'get_orders']);

Route::put('/lineup-status/{id}', [APIController::class, 'update_lineup_status']);
Route::put('/first-check/{id}', [APIController::class, 'first_check']);
Route::put('/update-printing/{id}', [APIController::class, 'update_printing']);

Route::put('/return-records', [APIController::class, 'return_records']);
Route::get('/get-errors/{id}', [APIController::class, 'get_errors']);
Route::get('/get-errors', [APIController::class, 'get_error']);

Route::put('/reprint-errors/{id}', [APIController::class, 'reprint_errors']);
Route::put('/printers/{printer}', [APIController::class, 'updateStatus']);


Route::put('/update_check/{id}', [APIController::class, 'update_check']);
Route::post('/add/picture', [APIController::class, 'add_picture']);
Route::get('/get_employees', [APIController::class, 'get_employees']);

Route::get('/fetch_notifications/{id}', [NotificationController::class, 'fetch']);
Route::get('/fetch_orders/{search}', [APIController::class, 'fetch_orders']);
Route::put('/update_notification_status/{id}', [NotificationController::class, 'update']);

Route::get('/chat/{user}', [ChatRoomController::class, 'user']);
Route::get('/order-chat/{order}', [ChatRoomController::class, 'order']);


        Route::get('/orders-per-month', [AnalyticsController::class, 'getOrdersPerMonth']);
        Route::get('/sales', [AnalyticsController::class, 'sales']);
        Route::get('/production', [AnalyticsController::class, 'production']);

Route::get('/size-charts', [SizeChartController::class, 'getSizeCharts']);
