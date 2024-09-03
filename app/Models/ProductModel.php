<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'path'
    ];

    public function designs(){
        return $this->hasMany(ModelDesigns::class,'model_id');
    }
}
