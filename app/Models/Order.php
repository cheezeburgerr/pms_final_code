<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['team_name', 'due_date', 'customer_id', 'total_price', 'downpayment'];
    // protected $casts = [
    //     'files' => 'array',
    // ];

    // protected static function booted()
    // {
    //     static::saving(function ($order) {
    //         // Check if the due date is 3 days away or past
    //         if (Carbon::parse($order->due_date)->lessThanOrEqualTo(Carbon::now()->addDays(3))) {
    //             $order->status = 'Overdue'; // Set the status
    //         }
    //     });
    // }

    public function products()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function lineups()
    {
        return $this->hasMany(Lineup::class);
    }

    public function files()
    {
        return $this->hasMany(OrderImage::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function production()
    {
        return $this->hasOne(ProductionDetails::class, 'order_id');
    }

    public function employees()
    {
        return $this->hasMany(ProductionEmployee::class, 'order_id');
    }

    public function approved()
    {
        return $this->hasMany(ApproveDesign::class, 'order_id')->latest();
    }

    public function latestapproved()
    {
        return $this->hasOne(ApproveDesign::class)->latestOfMany();
    }

    public function errors()
    {
        return $this->hasMany(Lineup::class, 'order_id')->where('status', 'Error');
    }

    public function reprint()
    {
        return $this->hasMany(Lineup::class, 'order_id')->where('status', 'Reprint');
    }

    public function chatroom ()
    {
        return $this->hasOne(ChatRoom::class, 'order_id');
    }

    
}
