<?php

namespace App\Http\Controllers;

use App\Models\Lineup;
use App\Models\Order;
use App\Models\ProductionDetails;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinalCheckingController extends Controller
{
    //

    public function index()
    {
        $order = Order::with('production.printer', 'lineups')
        ->whereHas('production', function ($query) {
            $query->where('status', 'Printing');
            
        })
        ->get();

        return Inertia::render('Employee/FinalChecking', ['order' => $order]);
    }

    public function show($id)
    {
        $order = Order::with('lineups',
         'production.printer')->find($id);
        

        return Inertia::render('Employee/FinalCheck', ['order' => $order]);
    }

    public function update (Request $request, $id) {
        $lineup = Lineup::find($id);

        $lineup->status = $request->printed;
        $lineup->note = null;
        $lineup->save();

        $progress = ProductionDetails::find($request->prodId);
        $progress->sewing_progress = $request->progress;
        $progress->save();
    }
}
