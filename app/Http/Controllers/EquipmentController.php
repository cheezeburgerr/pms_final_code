<?php

namespace App\Http\Controllers;

use App\Jobs\SendNotif;
use App\Models\Equipment;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    //
    public function index ()
    {
        $printers = Equipment::where('type', 'Printer')->get();
        return Inertia::render('Printers', ['printers' => $printers]);
    }

    public function updateStatus(Request $request, $id)
    {
        $printer = Equipment::find($id);
        // dd($printer->id);
        $request->validate([
            'status' => 'required|string|in:online,offline,maintenance',
        ]);

        $printer->update([
            'status' => $request->status,
        ]);

        $users = User::whereNotIn('user_type', ['Customer'])->get();
        if($printer->status == 'maintenance'){
            

            foreach ($users as $user) {
                $notif = Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Under Maintenance',
                    'message' => 'Equipment "'.$printer->equipment_name.'" under maintenance.',
                    'url' => ''
                ]);
    
                SendNotif::dispatch($notif);
            }
        }
        else{
            foreach ($users as $user) {
                $notif = Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Printer Status',
                    'message' => 'Equipment "'.$printer->equipment_name.'" is now'.$printer->status.' .',
                    'url' => ''
                ]);
    
                SendNotif::dispatch($notif);
            }
        }
        return back()->with('success', 'Printer status updated successfully.');
    }

}
