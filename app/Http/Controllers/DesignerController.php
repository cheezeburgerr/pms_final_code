<?php

namespace App\Http\Controllers;

use App\Models\ProductModel;
use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignerController extends Controller
{
    //

    public function index ()
    {

        $products = ProductModel::with('designs')->get();
        return Inertia::render('Designer/Designer', ['products' => $products]);
    }
}
