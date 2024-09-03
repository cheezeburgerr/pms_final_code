<?php

namespace App\Http\Controllers;

use App\Jobs\SendErrors;
use App\Jobs\SendNotif;
use App\Models\ApproveDesign;
use App\Models\ChatRoom;
use App\Models\Equipment;
use App\Models\Lineup;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Order;
use App\Models\ProductionDetails;
use App\Models\ProductionEmployee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    //


    public function login()
    {
        if (Auth::guard('employee')->user()) {
            return redirect()->route('employee.dashboard');
        }

        return Inertia::render('Employee/Login');
    }

    public function login_functionality(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        if (Auth::guard('employee')->attempt(['email' => $request->email, 'password' => $request->password])) {
            $employee = Auth::guard('employee')->user();

            if ($employee->user_type !== 'Employee') {
                Auth::guard('employee')->logout();
                return back();
            }

            return redirect()->intended('/employee/dashboard');
        } else {
            Session::flash('error-message', 'Invalid Email or Password');
            return back();
        }
    }

    public function logout()
    {
        Auth::guard('employee')->logout();
        return redirect()->route('employee.login');
    }



    public function dashboard()
    {
        $authUserId = Auth::guard('employee')->user();

        $orders = Order::with(['production.printer', 'employees'])
            ->withCount('products', 'lineups', 'errors', 'reprint')->orderBy('due_date', 'asc')->get();

            $errors = Lineup::with('order')->where('status', 'Reprint')->get();


            // dd($orders);
        // if(in_array($authUserId->dept_id, [1, 2])){

        //     $orders = $ordersQuery->whereHas('employees', function ($query) use ($authUserId) {
        //         $query->where('user_id', $authUserId->id);
        //     });


        //     if ($orders->count() === 0) {
        //         $orders = $ordersQuery->get();
        //     } else {
        //         $orders = $orders->get();
        //     }
        // }
        // else{
        //     $orders = $ordersQuery = Order::with(['production', 'employees'])
        //     ->withCount('products')->get();
        // }



        $printers = Equipment::withCount('orders')->where('type', 'Printer')->get();


        return Inertia::render('Employee/Dashboard', ['orders' => $orders, 'printers' => $printers, 'errors' => $errors]);
    }

    public function teams()
    {
        $order = Order::with('production', 'employees.employee', 'products.products')
        ->withCount('products', 'lineups')
        ->whereHas('production', function ($query) {
            $query->where('status', '!=', 'Pending');
        })->get();


        // dd($order);
        $user = Auth::guard('employee')->user();


        // if(in_array($user->dept_id, [1, 2])){
        //     $orderQuery = $order->whereHas('employees', function ($query) use ($user) {
        //         $query->where('user_id', $user->id);
        //     });

        //     if ($order->count() === 0) {
        //         $order = $orderQuery->get();
        //         // dd($order);
        //     } else {
        //         $order = $order->get();
        //     }
        // }
        // else if($user->dept_id === 3){
        //     $order = Order::with('production', 'employees')
        //     ->withCount('products')
        //     ->whereHas('production', function ($query) {
        //         $query->where('status', 'Printing');
        //     })->get();

        //     // dd($order);
        // }
        // else if($user->dept_id === 4){
        //     $order = Order::with('production', 'employees')
        //     ->withCount('products')
        //     ->whereHas('production', function ($query) {
        //         $query->whereIn('status', ['Printing', 'Sewing']);
        //     })->get();

        //     // dd($order);
        // }

        $artists = User::where('dept_id', 1)->get();

        // dd($order);
        return Inertia::render('Employee/Teams', ['order' => $order, 'artists' => $artists]);
    }

    public function production_details ($id) {

        $order = Order::with('production.printer', 'products.products', 'products.variations.category', 'products.variations.variations', 'lineups.products', 'files', 'customer', 'latestapproved', 'approved', 'errors')->withCount('products', 'lineups', 'errors')->find($id);
        return Inertia::render('Employee/ProductionDetails', ['order' => $order]);
    }

    public function view_order($id)
    {
        $order = Order::with('production', 'products.products', 'products.variations.category', 'products.variations.variations', 'lineups.products', 'files', 'customer', 'employees.employee')->find($id);

        return Inertia::render('Employee/OrderDetails', ['order' => $order]);
    }

    public function pending_teams()
    {
        $order = Order::with('production')
            ->withCount('products')
            ->whereHas('production', function ($query) {
                $query->where('status', 'Pending');
            })
            ->get();

        return Inertia::render('Employee/PendingTeams', ['order' => $order]);
    }

    public function return_records(Request $request)
{

    $requestData = $request->input('records');

    $count = 0;
    foreach ($requestData as $recordData) {

        $record = Lineup::find($recordData['id']);

        if ($record) {
            $record->status = 'Error';
            $record->note = $recordData['errorType'];
            $record->save();

            $count++;
        }
    }



    return to_route('employee.dashboard');
}



    public function without_artist()
    {
        $order = Order::with('production', 'employees')
        ->withCount('products')
        ->whereHas('production', function ($query) {
            $query->where('status', 'Designing');
        })
        ->whereDoesntHave('employees', function ($query) {
            $query->where('employee_role', 'Artist');
        })
        ->get();

        $artists = User::where('dept_id', 1)->get();

        // dd($order);
        return Inertia::render('Employee/WithoutArtist', ['order' => $order, 'artists' => $artists]);
    }

    public function assign(Request $request, $id)
    {

        $order = ProductionDetails::where('order_id', $id)->first();

        $order->note = 'Artist Assigned';
        $order->update();
        // dd($request);
        $artist = ProductionEmployee::create([
            'order_id' => $id,
            'user_id' => $request->input('artist'),
            'employee_role' => $request->input('role')
        ]);

        $notif = Notification::create([
            'user_id' => $artist->user_id,
            'title' => 'New Order For You',
            'message' => 'Order "'.$order->team_name.'" has been assigned to you. Check it out.',
            'url' => '/employee/view-order/'.$order->order_id
        ]);

        SendNotif::dispatch($notif);

        return redirect()->back()->with('success', 'Artist assigned successfully.');
    }

    public function approve (Request $request, $id)
    {

        $order = Order::with('production')->findOrFail($id);


        $order->production->status = 'Designing';
        $order->production->note = 'No Artist Assigned';
        $order->production->update();

        ProductionEmployee::create([
            'order_id' => $id,
            'user_id' => Auth::guard('employee')->id(),
            'employee_role' => 'CSR'
        ]);

        $supervisor = User::where('is_supervisor', 1)->get();
        foreach($supervisor as $a){
            $notif = Notification::create([
                'user_id' => $a->id,
                'title' => 'Assign Artist',
                'message' => 'Order "'.$order->team_name.'" has been approved. Assign artist to start the production.',
                'url' => '/employee/view-order/'.$order->id
            ]);

            SendNotif::dispatch($notif);
        }


        // dd('te');
        return to_route('employee.pending')->with('success', 'Order #'.$order->id.' Approved');
    }


    public function print ($id)
    {

        $order = Order::with('lineups', 'production')->find($id);

        return Inertia::render('Employee/Print', ['order' => $order]);
    }


    public function reprint ($id)
    {

        $order = Order::with('lineups', 'production')->find($id);

        return Inertia::render('Employee/Reprint', ['order' => $order]);
    }


    public function approve_design (Request $request)
    {


        if ($request->hasFile('file')) {
            $file = $request->file('file');


                $path = $file->store('images/orders/approvals', 'public');
                $path = $file->move('images/orders/approvals', $file->getClientOriginalName());

                ApproveDesign::create([
                    'order_id' => $request->order_id,
                    'image_name' => $file->getClientOriginalName(),
                    'status' => 'Waiting for Approval'
                ]);

                ProductionDetails::where('order_id', $request->order_id)->update([
                    'note' => 'Waiting for Approval'
                ]);
            }



        return redirect()->back();
    }


    public function change_status(Request $request, $id) {


        $order = ProductionDetails::find($id);

        $order->status = $request->status;

        if($request->status === 'Finished'){
            $order->end_production = Carbon::now();
            $notif = Notification::create([
                'user_id' => $request->customer,
                'title' => 'Order Ready to Pickup',
                'message' => 'Order "'.$order->team_name.'" is ready for you to pick it up. Go to the nearest branch to claim your order.',
                'url' => 'orders/'.$order->order_id
            ]);

            SendNotif::dispatch($notif);

        }

        $order->save();

        $emp = User::with('department')->where('id', Auth::guard('employee')->id())->first();



        ProductionEmployee::create([
            'order_id' => $order->order_id,
            'user_id' => Auth::guard('employee')->id(),
            'employee_role' => $request->role
        ]);

        return to_route('employee.dashboard')->with('success', $request->message);
    }

    public function release(Request $request, $id) {


        $order = ProductionDetails::find($id);

        $order->status = $request->status;
        $order->save();

        return to_route('employee.dashboard')->with('success', $request->message);
    }


    public function reprint_errors($id)
    {

        $lineups = Lineup::where('order_id', $id)->where('status', 'Error')->get();

        foreach($lineups as $lineup){
            $lineup->status = 'Reprint';
            $lineup->note = null;
            $lineup->save();
        }

        SendErrors::dispatch('Error alert');

        return redirect()->back();
    }


    public function chat()
    {

        $users = User::with('chatroom.lastmessage')->orderBy('id', 'desc')->get();
        $orders = Order::with('chatroom.lastmessage', 'employees.employee')->orderBy('id', 'desc')->get();
        // dd($users);
        // $messages = $users->messages()->with('user')->latest()->get();

        return Inertia::render('Employee/Chat', ['users' => $users, 'orders' => $orders]);
    }
}
