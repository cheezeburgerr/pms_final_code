<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Lineup;
use App\Models\Order;
use App\Models\Products;
use App\Models\Variation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Products::with('categories.variation')->get();
        return Inertia::render('Products/Index', [ 'products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'categories' => 'required|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'categories.*.name' => 'required|string|max:255',
            'categories.*.variations' => 'required|array',
            'categories.*.variations.*.name' => 'required|string|max:255',
            'categories.*.variations.*.price' => 'required|numeric',
        ]);

        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images/products'), $imageName);

        }
        // Create the product
        $product = Products::create([
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'image' => $imageName
        ]);


        // Create categories and variations
        foreach ($request->categories as $categoryData) {
            $category = $product->categories()->create([
                'category_name' => $categoryData['name'],
                // 'product_id' => $product->id()
            ]);

            foreach ($categoryData['variations'] as $variationData) {
                $category->variation()->create([
                    'variation_name' => $variationData['name'],
                    'variation_price' => $variationData['price'],
                    // 'category_id' => $category->id()
                ]);
            }
        }

        return to_route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $product)
    {
        $product->load('categories.variation');

        return Inertia::render('Products/Edit', [

            'product' => $product
        ]);
    }

    public function update(Request $request, Products $product)
    {
        // $request->validate([
        //     'product_name' => 'required|string|max:255',
        //     'product_price' => 'required|numeric',
        //     'categories' => 'required|array',
        //     'categories.*.name' => 'required|string|max:255',
        //     'categories.*.variations' => 'required|array',
        //     'categories.*.variations.*.name' => 'required|string|max:255',
        //     'categories.*.variations.*.price' => 'required|numeric',
        // ]);


        // dd($request->image);

        
        // Update the product
        $product->update([
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'image' => $request->image
        ]);


        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time().'.'.$image->getClientOriginalExtension();
            $image->move(public_path('images/products'), $imageName);
            $product->image = $imageName;
        } elseif ($product->image) {
            // Retain the old image if no new image is provided
            $product->image = $product->image;
        }
    
        $product->save();

        // Handle categories and variations
        foreach ($request->categories as $categoryData) {


            // dd($categoryData);
            $category = Category::updateOrCreate(
                ['id' => $categoryData['category_id'] ?? null, 'product_id' => $product->id],
                ['category_name' => $categoryData['category_name']]
            );

            foreach ($categoryData['variations'] as $variationData) {
                Variation::updateOrCreate(
                    ['id' => $variationData['variation_id'] ?? null, 'category_id' => $category->id],
                    ['variation_name' => $variationData['variation_name'], 'variation_price' => $variationData['variation_price']]
                );
            }
        }

        return to_route('products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    
}
