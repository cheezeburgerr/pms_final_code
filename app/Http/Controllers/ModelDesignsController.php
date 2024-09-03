<?php

namespace App\Http\Controllers;

use App\Models\ModelDesigns;
use App\Models\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ModelDesignsController extends Controller
{
    //
    // public function create()
    // {

    //     return Inertia::render('ModelDesigns/Create');
    // }
    public function edit($id)
    {
        $model = ProductModel::find($id);
        return Inertia::render('ModelDesigns/Edit', ['model' => $model]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'design' => 'required|file|mimes:jpg,jpeg,png,svg',  // Adjust validation as needed
            // 'model_id' => 'required|exists:product,id',
        ]);

        // Handle the file upload
        // $path = 

        // Save the design to the database
        ModelDesigns::create([
            'model_id' => $request->input('model_id'),
            'name' => $request->input('name'),
            'file' => $request->file('design')->store('canvas', 'public'),
        ]);

        return redirect()->back()->with('success', 'Design added successfully!');
    }

    public function destroy($id)
    {
        $design = ModelDesigns::findOrFail($id);

        // Delete the design file
        if (Storage::disk('public')->exists($design->file)) {
            Storage::disk('public')->delete($design->file);
        }

        // Delete the design record from the database
        $design->delete();

        return redirect()->back()->with('success','Yes');
    }
    
}
