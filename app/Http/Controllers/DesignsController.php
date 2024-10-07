<?php

namespace App\Http\Controllers;

use App\Models\Designs;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DesignsController extends Controller
{
    //

    public function index()
    {
        $designs = Designs::all();
        $products = Products::all();
        return Inertia::render("Employee/Designs/Designs", ['designs' => $designs, 'products' => $products]);
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

    public function edit($id) {

        $products = Products::all();
        $design = Designs::find($id);

        return Inertia::render('Employee/Designs/Edit', ['design' => $design, 'products' => $products]);
    }

    public function update(Request $request, $id)
{
    // Validate request input
    $request->validate([
        // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Check for valid image file
        'name' => 'required|string|max:255',
        'product_id' => 'required|exists:products,id', // Ensure product_id exists in the products table
        // 'description' => 'required|string',
    ]);

    // Find the design by ID
    $design = Designs::findOrFail($id);

   
    if ($request->hasFile('image')) {

        if ($design->image) {
            Storage::delete('public/designs/' . $design->image);
        }

 
        $imageName = time() . '.' . $request->image->extension();
        $request->image->storeAs('public/designs', $imageName);

        // Update design image field
        $design->image = $imageName;
    }

    $design->name = $request->name;
    // Save changes to the design
    $design->save();

    return redirect()->route('designs.index')->with('success', 'Design updated successfully');
}

    public function show($id)
    {
        $design = Designs::with('product.categories.variation')->findOrFail($id);
        return Inertia::render('DesignInfo', ['design' => $design]);
    }
}
