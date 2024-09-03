<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Designs extends Model
{
    use HasFactory;

    protected $fillable = [
        "name","image","product_id"
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}