<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class SizeChartController extends Controller
{
    private $xmlPath;

    public function __construct()
    {
        $this->xmlPath = storage_path('app/public/size_charts/size_chart.xml');
    }

    public function index()
    {

        $folderPath = storage_path('app/public/size-charts'); 

        // Get all XML files from the folder
        $sizeChartFiles = File::files($folderPath);

        // Prepare size chart data (if needed, you can also parse the XML here)
        $sizeCharts = array_map(function($file) {
            return [
                'filename' => $file->getFilename(),
                'path' => asset('size-charts/' . $file->getFilename())
            ];
        }, $sizeChartFiles);
        
       return Inertia::render('Admin/SizeChart', ['sizeCharts' => $sizeCharts]);
    }

    // public function show () {
    //     return Inertia::render('SizeChartForm');
    // }

    // public function addProduct(Request $request)
    // {
    //     $xml = simplexml_load_file($this->xmlPath);
    //     $newProduct = $xml->addChild('product');
    //     $newProduct->addAttribute('id', uniqid());
    //     $newProduct->addChild('name', $request->name);
        
    //     // Add sizes
    //     foreach ($request->sizes as $size) {
    //         $sizeNode = $newProduct->addChild('size');
    //         $sizeNode->addChild('sizeType', $size['sizeType']);
    //         $measurements = $sizeNode->addChild('measurements');
    //         $measurements->addChild('chest', $size['chest']);
    //         $measurements->addChild('waist', $size['waist']);
    //     }

    //     $xml->asXML($this->xmlPath);
    //     return response()->json(['message' => 'Product added successfully'], 200);
    // }

    // public function updateProduct(Request $request, $id)
    // {
    //     $xml = simplexml_load_file($this->xmlPath);
    //     foreach ($xml->product as $product) {
    //         if ((string)$product['id'] === $id) {
    //             $product->name = $request->name;
                
    //             // Clear existing sizes
    //             foreach ($product->size as $size) {
    //                 $dom = dom_import_simplexml($size);
    //                 $dom->parentNode->removeChild($dom);
    //             }

    //             // Add new sizes
    //             foreach ($request->sizes as $size) {
    //                 $sizeNode = $product->addChild('size');
    //                 $sizeNode->addChild('sizeType', $size['sizeType']);
    //                 $measurements = $sizeNode->addChild('measurements');
    //                 $measurements->addChild('chest', $size['chest']);
    //                 $measurements->addChild('waist', $size['waist']);
    //             }

    //             $xml->asXML($this->xmlPath);
    //             return response()->json(['message' => 'Product updated successfully'], 200);
    //         }
    //     }
    //     return response()->json(['message' => 'Product not found'], 404);
    // }


    public function getSizeCharts()
{
    $xmlFiles = File::files(storage_path('app/public/size-charts'));
    $sizeCharts = [];

    foreach ($xmlFiles as $file) {
        $xmlContent = simplexml_load_file($file);
        $sizeCharts[] = [
            'filename' => $file->getFilename(),
            'data' => json_decode(json_encode($xmlContent), true), // Convert XML to array
        ];
    }

    return response()->json($sizeCharts);
}

    public function show($name)
{
    // Find the product by ID
    // $product = Products::findOrFail($id);

    // Path to the product's XML size chart file
    // $xmlFilePath = storage_path("app/public/size-charts/{$product->id}.xml");
    $xmlFilePath = storage_path('app/public/size-charts/' . $name);

    // dd($xmlFilePath);
    // Load the XML file content
    if (file_exists($xmlFilePath)) {
        $xmlContent = simplexml_load_file($xmlFilePath);
        // dd($xmlContent);
    } else {
        // Create a new XML document
        // $xml = new \SimpleXMLElement('<Product/>');

        // // Set the product's attributes
        // $xml->addAttribute('id', $product->id);
        // $xml->addAttribute('name', $product->name);

        // // Create the Sizes element
        // $sizes = $xml->addChild('Sizes');

        // // Define the size data (you can modify this as needed)
        // $sizesData = [
        //     [
        //         'Name' => 'Small',
        //         'Measurements' => [
        //             'Width' => '34-38',
        //             'Height' => '28-30',
        //         ],
        //     ],
        //     [
        //         'Name' => 'Medium',
        //         'Measurements' => [
        //             'Width' => '38-40',
        //             'Height' => '32-34',
        //         ],
        //     ],
        //     [
        //         'Name' => 'Large',
        //         'Measurements' => [
        //             'Width' => '42-44',
        //             'Height' => '36-38',
        //         ],
        //     ],
        //     [
        //         'Name' => 'Extra Large',
        //         'Measurements' => [
        //             'Width' => '46-48',
        //             'Height' => '40-42',
        //         ],
        //     ],
        // ];

        // // Loop through the size data to create Size elements
        // foreach ($sizesData as $sizeData) {
        //     $size = $sizes->addChild('Size');
        //     $size->addChild('Name', $sizeData['Name']);
        //     $measurements = $size->addChild('Measurements');
        //     $measurements->addChild('Width', $sizeData['Measurements']['Width']);
        //     $measurements->addChild('Height', $sizeData['Measurements']['Height']);
        // }

        // // Save the XML content to the public/size-charts directory
        // $xml->asXML($xmlFilePath); // Save as {$product->id}.xml in public/size-charts

        // // Load the newly created XML content
        // $xmlContent = simplexml_load_file($xmlFilePath);
        $xmlContent = null;
    }

    // dd($name);

    return Inertia::render('SizeChartPage', [
        // 'product' => $product,
        'filename' => $name,
        'sizeChartData' => $xmlContent,
    ]);
}



    // public function update(Request $request, $id)
    // {

    //     // dd($request->all());
    //     // Find the product by its ID
    //     $product = Products::findOrFail($id);
    
    //     // Validate request inputs
    //     $request->validate([
    //         'sizeChart' => 'required|string',
    //     ]);
    
    //     // Create the XML file path
    //     $xmlFilePath = storage_path("app/public/size-charts/{$product->id}.xml");
    
    //     // Load the existing XML file or create a new one
    //     $xmlContent = $request->input('sizeChart');
    
    //     // Optional: Validate that the XML is well-formed
    //     if (!$this->isValidXML($xmlContent)) {
    //         return redirect()->back()->withErrors(['sizeChart' => 'Invalid XML format.']);
    //     }
    
    //     // Save the updated XML data to the file
    //     file_put_contents($xmlFilePath, $xmlContent);
    
    //     return redirect()->back()->with('success', 'Size chart updated successfully!');
    // }
    
    // // Method to validate XML
    // private function isValidXML($xmlString) {
    //     libxml_use_internal_errors(true);
    //     $doc = simplexml_load_string($xmlString);
    //     if ($doc === false) {
    //         return false; // Invalid XML
    //     }
    //     return true; // Valid XML
    // }

    public function create() {
        return Inertia::render('Admin/AddSizeChart');
    }
    public function store(Request $request)
{

    // dd($request->all());
    $sizeChartXml = $request->input('sizeChart');
    $filename =  $request->input('name') . ".xml";

    // Save the XML file to a directory
    // Storage::put("size-charts/{$filename}", $sizeChartXml);
    // $filename = "size_chart.xml";
$path = storage_path("app/public/size-charts/{$filename}");
file_put_contents($path, $sizeChartXml);
    
    return redirect()->route('size-chart.index')->with('success', 'Size Chart XML created successfully!');
}

    public function update(Request $request, $name)
    {
        // Validate the request to ensure sizeChartData is present
        $request->validate([
            'sizeChart' => 'required|string', // Ensure sizeChart is required
        ]);
    
        // Find the product by its ID
        // $product = Products::findOrFail($id);
    
        // Retrieve the XML data from the request
        $xmlData = $request->input('sizeChart');
    
        // Define the path where you want to save the XML file
        $xmlFilePath = storage_path("app/public/size-charts/{$name}");
        // dd($xmlFilePath);
        // Check if the directory exists; if not, create it
        if (!file_exists(dirname($xmlFilePath))) {
            mkdir(dirname($xmlFilePath), 0755, true);
        }
    
        // Save the updated XML data to the file
        file_put_contents($xmlFilePath, $xmlData);
    
        // Return a success message
        return redirect()->back()->with('success', 'Size chart updated successfully!');
    }
    

}
