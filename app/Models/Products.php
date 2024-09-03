<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_name',
        'product_price',
        'image'
    ];


    public function categories ()
    {
        return $this->hasMany(Category::class, 'product_id');
    }

    public function designs()
    {
        return $this->hasMany(Designs::class, 'product_id');
    }
}
