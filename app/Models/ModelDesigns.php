<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelDesigns extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "model_id",
        "file"
    ];
protected $table = 'model_designs';

public function product(){
    return $this->belongsTo(ProductModel::class, 'model_id');
}
}
