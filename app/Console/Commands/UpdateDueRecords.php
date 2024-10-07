<?php

namespace App\Console\Commands;

use App\Jobs\SendNotif;
use App\Models\Notification;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateDueRecords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:update-due';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now()->toDateString(); // Get current date in 'Y-m-d' format

        // Fetch orders where due_date is today
        $orders = Order::with('production', 'employees')
            ->whereDate('due_date', '<=', Carbon::today()) // Filters where the due_date is today or in the past
            ->whereHas('production', function ($query) {
                $query->whereNotIn('status', ['Finished', 'Released', 'Overdue']); // Filters out 'Finished' and 'Released' statuses
            })
            ->get();

        foreach ($orders as $order) {
         
            $order->production->status = 'Overdue'; 
            $order->production->save();

           

            foreach ($order->employees as $user) {
                $notif = Notification::create([
                    'user_id' => $user->user_id,
                    'title' => 'Order Overdue',
                    'message' => 'The order '.$order->team_name.' did not meet the due date. The order production is now closed.',
                    'url' => ''
                ]);
                SendNotif::dispatch($notif);
            }

            $notif = Notification::create([
                'user_id' => $order->customer_id,
                'title' => 'Order Overdue',
                'message' => 'The order '.$order->team_name.' did not finished in due time. Please contact the customer service for more information.',
                'url' => ''
            ]);
            SendNotif::dispatch($notif);
            
        }

        // Optionally, output the number of records updated
        $this->info(count($orders) . ' orders updated.');

        // return Command::SUCCESS;
    }
}
