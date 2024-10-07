<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionEmployee extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'employee_role'
    ];

    public function employee() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orders()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
