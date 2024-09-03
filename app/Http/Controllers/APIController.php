<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Equipment;
use App\Models\Gallery;
use App\Models\Lineup;
use App\Models\Order;
use App\Models\ProductionDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class APIController extends Controller
{
    //
    public function fetch_orders($search) {


        $order = Order::with('production')->where('team_name', 'LIKE', "%$search%")->get();

        return response()->json($order);
    }

    public function get_teams() {

        $employee = Auth::guard('employee')->user();
        $order = Order::select('*', 'orders.id AS order_id')->leftJoin('products', 'orders.product_id', 'products.id')->leftJoin('production_details', 'orders.production_details_id', 'production_details.production_details_id')->leftJoin('employees', 'production_details.artist_id', 'employees.employee_id')->with('products.attributes', 'attributes')->orderBy('orders.due_date', 'desc')->where('production_details.artist_id', $employee->employee_id)->get();

        return response()->json($order);
    }

    public function fetch_pending()
    {
        $teams =  Order::select('*', 'orders.id AS order_id')->leftJoin('products', 'orders.product_id', 'products.id')->leftJoin('production_details', 'orders.production_details_id', 'production_details.production_details_id')->where('production_details.status', 'Pending')->get();

        return response()->json($teams);
    }

    public function withoutArtist()
    {
        $teams =  Order::select('*', 'orders.id AS order_id')->leftJoin('products', 'orders.product_id', 'products.id')->leftJoin('production_details', 'orders.production_details_id', 'production_details.production_details_id')->where('production_details.artist_id', null)->where('production_details.status', 'Designing')->get();

        return response()->json($teams);
    }

    public function approve(Request $request)
    {
        $order = ProductionDetails::find($request->order_id);
        $order->status = 'Designing';

        $order->save();

        return response()->json(['message' => 'Order status updated successfully'], 200);
    }

    public function assign(Request $request, $id)
    {
        $order = ProductionDetails::findOrFail($id);

        $order->artist_id = $request->option;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully'], 200);
    }

    public function assign_printer(Request $request, $id)
    {
        $order = ProductionDetails::findOrFail($id);

        $order->printer_id = $request->option;
        $order->status = "Ready to Print";
        $order->save();

        return response()->json(['message' => 'Order status updated successfully'], 200);
    }

    public function update_lineup_status (Request $request, $id) {
        $lineup = Lineup::find($id);

        $lineup->status = $request->printed;
        $lineup->note = null;
        $lineup->save();

        $progress = ProductionDetails::find($request->prodId);
        $progress->printing_progress = $request->progress;
        $progress->save();
    }

    public function get_lineup($id)
    {

        $lineup = Lineup::where('order_id', $id)->get();
        return response()->json($lineup);
    }

    public function update_check (Request $request, $id) {
        $lineup = Lineup::find($id);

        $lineup->status = $request->printed;
        $lineup->note = null;
        $lineup->save();
    }

    public function first_check (Request $request, $id) {
        $lineup = Lineup::find($id);

        $lineup->status = $request->printed;
        $lineup->save();

        $progress = ProductionDetails::find($request->prodId);
        $progress->progress = $request->progress;
        $progress->save();
    }

    public function update_printing (Request $request, $id) {
        $order = ProductionDetails::find($id);

        $order->note = $request->status;
        $order->save();
    }


    public function return_records (Request $request) {
        $requestData = $request->all();

        foreach ($requestData as $recordData) {
            $record = Lineup::find($recordData['id']);

            if ($record) {
                // Update record with error type
                $record->status = 'Error';
                $record->note = $recordData['errorType'];
                $record->save();
            }
        }

        return response()->json(['message' => 'Records updated successfully'], 200);
    }

    public function get_error(){
        $lineup = Lineup::where('status', 'Reprint')->get();

        return response()->json($lineup);
    }


    public function get_errors($id){
        $lineup = Lineup::where('order_id', $id)->where('status', 'Reprint')->get();

        return response()->json($lineup);
    }

    public function reprint_errors(Request $request, $id){
        $lineup = Lineup::where('order_id', $id)->where('status', 'Error')->get();

        foreach($lineup as $l){
            $l->status = $request->status;
            $l->save();
        }

        return response()->json($lineup);
    }

    public function updateStatus(Request $request, Equipment $printer)
    {
        $validatedData = $request->validate([
            'equipment_status' => 'required|in:Working,Under Maintenance',
        ]);

        $printer->update($validatedData);

        return response()->json(['message' => 'Printer status updated successfully'], 200);
    }

    // public function add_picture (Request $request) {
    //     if ($request->has('image')) {
    //         $imagePath = $request->file('image');
    //         $name = time() . '.' . $imagePath->getClientOriginalExtension();
    //         $imagePath->move('images/gallery', $name);
    //     }

    //     Gallery::create([
    //         'image' => $imagePath,
    //         'description' => $request->description,
    //         'product_id' => $request->product_id
    //     ]);

    //     return to_route('admin.products')->with('success', 'Product Successfully Added');
    // }
    // public function get_employees() {

    //     $employees = Employee::with('department')->get();

    //     return response()->json($employees);
    // }



    public function cancel_order(Request $request, $id) {
        $order = ProductionDetails::find($id);

        $order->status = $request->status;
        $order->save();

        return to_route('profile.show')->with('success', 'Order Successfully Cancelled');
    }

    public function get_orders() {
        $orders = Order::with(['production.printer', 'employees'])
            ->withCount('products', 'lineups', 'errors', 'reprint')->orderBy('due_date', 'asc')->get();

        return response()->json($orders);
    }

    
}
