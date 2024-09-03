<?php

namespace App\Http\Controllers;

use App\Models\ModelDesigns;
use App\Models\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductModelController extends Controller
{
    //
    public function index ()
    {
        $models = ProductModel::all();

        return Inertia::render('Models/Index', ['models' => $models]);
    }

    public function create ()
    {

        return Inertia::render('Models/Create');
    }


    public function store(Request $request)
    {
        // $request->validate([
        //     'model' => 'required|file|mimes:glb,gltf,obj',
        //     'canvas' => 'required|file|mimes:svg', // Assuming 'canvas' is the name of your SVG file input
        //     'name' => 'required|string',
        //     // Add any other fields you want to validate and store
        // ]);

        $modelFile = $request->file('model');
        $svgFile = $request->file('canvas');
        $name = $request->input('name');

        // Generate unique names for storing files
        $modelFileName = uniqid() . '_' . $modelFile->getClientOriginalName();
        $svgFileName = uniqid() . '_' . $svgFile->getClientOriginalName();

        // Store the files with their new names and original extensions
        $model_path = $modelFile->storeAs('public/models', $modelFileName);
        $canvas_path = $svgFile->storeAs('public/canvas', $svgFileName);

        // Save information to database
        $model = new ProductModel();
        $model->name = $name;
        $model->path = $modelFileName;
        $model->canvas_path = $svgFileName;
        $model->save();

        return redirect()->route('models.index');
    }

    public function edit ($id){

        $model = ProductModel::with('designs')->find($id);
        return Inertia::render('Models/Edit', ['model'=> $model]);
    }

}
