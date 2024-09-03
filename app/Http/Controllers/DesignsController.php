<?php

namespace App\Http\Controllers;

use App\Models\Designs;
use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignsController extends Controller
{
    //

    public function index()
    {
        $designs = Designs::all();
        $products = Products::all();
        return Inertia::render("Employee/Designs", ['designs' => $designs, 'products' => $products]);
    }
    
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'product_id' => 'required|exists:products,id', // Ensure product_id exists in the products table
            'description' => 'required|string',
        ]);

        // Store the image and get the path
        $imagePath = $request->file('image')->store('designs', 'public');

        // Store the data in the database
        $design = Designs::create([
            'name' => $validatedData['name'],
            'image' => $imagePath,
            'product_id' => $validatedData['product_id'],
            'description' => $validatedData['description'],
        ]);

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Design added successfully!');
    }

    public function show($id)
    {
        $design = Designs::with('product.categories.variation')->findOrFail($id);
        return Inertia::render('DesignInfo', ['design' => $design]);
    }
}
