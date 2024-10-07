<?php

namespace App\Http\Controllers;

use App\Models\Lineup;
use App\Models\Order;
use App\Models\ProductionDetails;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckingController extends Controller
{
    //

    public function index()
    {
        $order = Order::with('production.printer', 'lineups')->whereHas('production', function ($query) {
            $query->whereIn('status', ['Printing', 'Sewing']);
        })->get();

        $all = Order::with('production.printer', 'lineups')
    ->whereHas('production', function ($query) {
        $query->whereNotIn('status', ['Pending', 'Designing']);
    })
    ->whereHas('lineups', function ($query) {
        $query->whereIn('note', ['Replacement', 'Reprint']);
    })
    ->get();

        return Inertia::render('Employee/Checking', ['order' => $order, 'allOrders' => $all]);
    }

    public function show($id)
    {
        $order = Order::with('lineups', 'production')->find($id);

        return Inertia::render('Employee/Check', ['order' => $order]);
    }

    public function update (Request $request, $id) {
        $lineup = Lineup::find($id);

        $lineup->status = $request->printed;
        $lineup->note = null;
        $lineup->save();

        $progress = ProductionDetails::find($request->prodId);
        $progress->printing_progress = $request->progress;
        $progress->save();
    }
}
