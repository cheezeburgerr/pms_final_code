<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'product_id', 'subtotal'];

    public function variations()
    {
        return $this->hasMany(OrderVariation::class, 'product_id');
    }

    public function products()
    {
        return $this->hasMany(Products::class, 'id', 'product_id');
    }
}
