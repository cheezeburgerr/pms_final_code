<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\CheckingController;
use App\Http\Controllers\DesignerController;
use App\Http\Controllers\DesignsController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\FinalCheckingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ModelDesignsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductModelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SizeChartController;
use App\Models\Designs;
use App\Models\ModelDesigns;
use App\Models\Notification;
use App\Models\ProductionDetails;
use App\Models\Products;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    $products = Products::all();
    $designs = Designs::limit(6)->get();
    return Inertia::render('Dashboard', ['products' => $products, 'designs' => $designs]);
})->name('dashboard');

// Route::get('order', [OrderController::class, 'index'])->name('order');
// Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

Route::post('/broadcasting/auth', function () {
    return Auth::user();
 });

 Route::get('designinfo/{id}', [DesignsController::class, 'show'])->name('design.info');

 
//  Route::middleware(['auth:sanctum', 'verified'])->get('/chat/{user}', [ChatRoomController::class, 'index'])->name('chat');
Route::post('/messages', [MessageController::class, 'store']);

Route::prefix('employee')->group(function () {
    Route::get('login', [EmployeeController::class, 'login'])->name('employee.login');
    Route::post('login', [EmployeeController::class, 'login_functionality'])->name('login.functionality');

    Route::middleware('employee')->group(function () {

        Route::post('proceed/{id}', function (Request $request, $id) {
            $order = ProductionDetails::where('order_id', $id)->first();
        
            $order->status = 'Printing';
            $order->printer_id = $request->input('printer');
            $order->note = 'Ready To Print';
            $order->start_production = Carbon::now();
            $order->save();
        
            $operator = User::where('dept_id', 3)->get();


            foreach($operator as  $o){
                $notif = Notification::create([
                    'user_id' => $o->id,
                    'title' => 'Order Ready to Print',
                    'message' => 'Order "'.$order->team_name.'" is ready for printing. Click here to print.',
                    'url' => 'employee/print/'.$order->order_id
                ]);
            }
        
        
            return to_route('employee.dashboard')->with('success', 'Order proceeded to production.');;
        })->name('print.submit');

        Route::get('/dashboard', [EmployeeController::class, 'dashboard'])->name('employee.dashboard');
        Route::post('/logout', [EmployeeController::class, 'logout'])->name('employee.logout');
        Route::get('/view-order/{id}', [EmployeeController::class, 'view_order'])->name('employee.vieworder');
        Route::get('/production-details/{id}', [EmployeeController::class, 'production_details'])->name('employee.production');
        Route::get('/pending-teams', [EmployeeController::class, 'pending_teams'])->name('employee.pending');
        Route::get('/teams', [EmployeeController::class, 'teams'])->name('employee.teams');
        Route::post('/approve-design', [EmployeeController::class, 'approve_design'])->name('employee.approvedesign');

        Route::put('/cancel-order/{id}', [OrderController::class, 'cancel_order'])->name('cancel.order');
        Route::get('/print/{id}', [EmployeeController::class, 'print'])->name('employee.print');
        Route::get('/reprint/{id}', [EmployeeController::class, 'reprint'])->name('employee.reprint');
        Route::get('/without-artist', [EmployeeController::class, 'without_artist'])->name('employee.artist');
        Route::resource('/checking', CheckingController::class);
        Route::resource('/final-checking', FinalCheckingController::class);

        Route::get('/chat', [EmployeeController::class, 'chat'])->name('employee.chat');
        Route::put('/reprint-errors/{id}', [EmployeeController::class, 'reprint_errors'])->name('reprint.errors');
        Route::put('/change-status/{id}', [EmployeeController::class, 'change_status'])->name('employee.changestatus');
        Route::put('/release/{id}', [EmployeeController::class, 'release'])->name('employee.release');
        Route::put('/return-records', [EmployeeController::class, 'return_records'])->name('employee.returnrecords');
        Route::post('/assign-artist/{id}', [EmployeeController::class, 'assign'])->name('employee.assign-artist');
        Route::post('/approve/{id}', [EmployeeController::class, 'approve'])->name('employee.approve');
        // Route::resource('/products', ProductController::class);
        Route::post('logout', [EmployeeController::class, 'logout'])->name('employee.logout');

        Route::resource('models', ProductModelController::class);
        Route::resource('model_designs', ModelDesignsController::class);
        Route::resource('designs', DesignsController::class);
       
       
        
        Route::get('printers', [EquipmentController::class, 'index'])->name('printers');
        Route::post('/printer_update/{id}', [EquipmentController::class, 'updateStatus'])->name('printer_update');
        Route::post('/set-priority/{id}', [OrderController::class, 'set_priority'])->name('employee.priority');
        Route::post('/remove-priority/{id}', [OrderController::class, 'remove_priority'])->name('employee.removeprio');
        Route::get('/profile/{id}', [EmployeeController::class,'profile'])->name('employee.profile');
        Route::get('/profile/{id}/edit', [EmployeeController::class,'edit'])->name('edit.profile');
        Route::get('/orders/export-pdf', [OrderController::class, 'exportPdf'])->name('orders.exportPdf');
    });
});

Route::post('/size-chart/add', [SizeChartController::class, 'addProduct'])->name('size.chart.add');
Route::post('/size-chart/update/{id}', [SizeChartController::class, 'updateProduct'])->name('size.chart.update');
Route::get('size-chart', [SizeChartController::class, 'show'])->name('size.show');
Route::get('/test', function () {
    return 'Test page is working';
});

Route::prefix('admin')->group(function () {
    Route::get('login', [AdminController::class, 'login'])->name('admin.login');
    Route::post('login', [AdminController::class, 'login_functionality'])->name('admin.login.functionality');

    Route::middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');
        Route::get('/view-order/{id}', [AdminController::class, 'view_order'])->name('admin.vieworder');
        Route::get('/production-details/{id}', [AdminController::class, 'production_details'])->name('admin.production');
        Route::get('/pending-teams', [AdminController::class, 'pending_teams'])->name('admin.pending');
        Route::get('/teams', [AdminController::class, 'teams'])->name('admin.teams');
        Route::post('/approve-design', [AdminController::class, 'approve_design'])->name('admin.approvedesign');

        Route::put('/cancel-order/{id}', [OrderController::class, 'cancel_order'])->name('cancel.order');
        Route::get('/print/{id}', [AdminController::class, 'print'])->name('admin.print');
        Route::get('/reprint/{id}', [AdminController::class, 'reprint'])->name('admin.reprint');
        Route::get('/without-artist', [AdminController::class, 'without_artist'])->name('admin.artist');
        // Route::resource('/final-checking', FinalCheckingController::class);
        Route::resource('employees', EmployeesController::class);
        Route::get('/chat', [AdminController::class, 'chat'])->name('admin.chat');


        Route::get('/sales', [AnalyticsController::class, 'counts'])->name('sales');
        Route::get('/production', [AnalyticsController::class, 'production_chart'])->name('production');
        Route::resource('/products', ProductController::class);
        
        Route::get('/products/{name}/size-chart', [SizeChartController::class, 'show'])->name('products.sizeChart');
        Route::put('/products/{name}/size-chart', [SizeChartController::class, 'update'])->name('products.sizeChart.update');

        Route::resource('size-chart', SizeChartController::class);
        // Route::get('/orders/export-pdf', [OrderController::class, 'exportPdf'])->name('orders.exportPdf');
    });
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('designer', DesignerController::class);
    Route::get('/profile-show', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('/picture', [ProfileController::class, 'picture'])->name('profile.picture');

    Route::get('/lineup-edit/{id}', [OrderController::class, 'lineup_edit'])->name('lineup.edit');
    Route::put('/lineup-update', [OrderController::class, 'lineup_update'])->name('lineup_update');
    Route::get('/return/{id}', [OrderController::class, 'return'])->name('orders.return');
    Route::put('/return-records', [OrderController::class, 'return_records'])->name('returnrecords');
    Route::resource('orders', OrderController::class);
    
    Route::post('order', [OrderController::class,'order'])->name('order');
    Route::get('add-product/{id}', [OrderController::class,'add_product'])->name('add.product');
    Route::post('add-product', [OrderController::class,'store_product'])->name('store.product');
    Route::post('design_order', [OrderController::class,'design_order'])->name('design.order');
    Route::put('/order-update/{id}', [OrderController::class, 'update'])->name('order.update');
    Route::resource('order-product', OrderProductController::class);
    Route::get('approval/{id}', [OrderController::class, 'approval'])->name('orders.approval');
    Route::put('/approve', [OrderController::class, 'approve'])->name('orders.approve');
    Route::put('/reject', [OrderController::class, 'reject'])->name('orders.reject');
    Route::get('order-downpayment/{id}', [OrderController::class, 'summary'])->name('orders.downpayment');
    Route::post('downpayment/{id}', [OrderController::class, 'downpayment_store'])->name('downpayment');

    Route::get('/chat', [ChatRoomController::class, 'index'])->name('chat');
});

require __DIR__ . '/auth.php';
