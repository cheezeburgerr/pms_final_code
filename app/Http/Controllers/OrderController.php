<?php

namespace App\Http\Controllers;

use App\Jobs\SendNotif;
use App\Models\ApproveDesign;
use App\Models\Designs;
use App\Models\Lineup;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\OrderVariation;
use App\Models\ProductionDetails;
use App\Models\Products;
use App\Models\User;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    //

    public function index () {

        $products = Products::with('categories.variation')->get();
        return Inertia::render('Order', ['products' => $products]);
    }

    public function order (Request $request) { 

        // dd($request->image);

        $product_id = $request->product_id; 
        $design = Designs::with('product')->findOrFail($request->image);
        // dd($image);
        $products = Products::with('categories.variation')->get();
        return Inertia::render('Order', ['products' => $products, 'product_id' => $product_id, 'image' => $design]);
    }
    public function design_order (Request $request) { 

   

        // $product_id = $request->product_id;
    
        // dd($request->data['image_data']);
        $products = Products::with('categories.variation')->get();
        return Inertia::render('Order', ['products' => $products, 'design' => $request->data['image_data']]);
    }

    public function edit ($id)
    {
        $order = Order::with('files', 'products.products')->find($id);

        return Inertia::render('Order/EditOrder', ['order' => $order]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::with('files')->findOrFail($id);

        dd($request->input());
        // Validate request
        // $request->validate([
        //     'team_name' => 'required|string|max:255',
        //     'due_date' => 'required|date',
        //     'newFiles.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        // ]);

        // Update order details
        $order->team_name = $request->input('team_name');
        $order->due_date = $request->input('due_date');

        // Handle previous files removal
        $previousFiles = $request->input('previousFiles', []);
        $previousFileNames = array_column($previousFiles, 'id');

        $order->files()->whereNotIn('id', $previousFileNames)->delete();

        // Handle new file uploads
        if ($request->hasFile('newFiles')) {
            foreach ($request->file('newFiles') as $file) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/orders'), $fileName);

                $order->files()->create([
                    'file_name' => $fileName,
                    'file_path' => 'images/orders/' . $fileName
                ]);
            }
        }

        // Save the order
        $order->save();

        return redirect()->route('orders.show', $order->id)
                         ->with('success', 'Order updated successfully');
    }

    public function summary ($id) {
        $order = Order::with('products.products', 'products.variations.category', 'products.variations.variations', 'lineups.products', 'files')->find($id);
        // dd($order);
        if($order->downpayment == null) {
            return Inertia::render('Order/OrderDownpayment', ['order' => $order]);
        }

        return redirect()->route('orders.show', $order->id);
    }

    public function downpayment_store (Request $request, $id) {
        $order = Order::find($id);


        if ($request->has('image')) {
            $imagePath = $request->file('image');
            $name = time() . '.' . $imagePath->getClientOriginalExtension();
            $imagePath->move('images/customers/downpayment', $name);
        }

        $order->downpayment = $name;
        $order->save();

        return to_route('dashboard', ['id' => $id]);
    }

    public function show ($id) {

        $order = Order::with('production', 'products.products', 'products.variations.category', 'products.variations.variations', 'lineups.products', 'files', 'customer', 'latestapproved', 'employees.employee')->find($id);
        if(!$order){
            return redirect()->route('dashboard');
        }

        if(Auth::user()->id !== $order->customer->id){
            return redirect()->route('dashboard');
        }
        
        return Inertia::render('Order/OrderDetails', ['order' => $order]);
    }

    public function set_priority($id) {
        $order = Order::with('production')->find($id);
        $order->production->priority = 'Yes';
        $order->production->save();

        return redirect()->back()->with('success', 'Order Prioritized.');
    }

    public function remove_priority($id) {
        $order = Order::with('production')->find($id);
        $order->production->priority = null;
        $order->production->save();

        return redirect()->back()->with('success', 'Order Priority Removed.');;
    }
    public function store(Request $request)
    {
        // $validatedData = $request->validate([
        //     'team_name' => 'required|string|max:255',
        //     'due_date' => 'required|date',
        //     'products' => 'required|array',
        //     'products.*.id' => 'required|exists:products,id',
        //     'products.*.variations' => 'array',
        //     'lineups' => 'required|array',
        //     'lineups.*.player_name' => 'required|string|max:255',
        //     'lineups.*.product' => 'required|exists:products,id',
        //     'lineups.*.classification' => 'required|string',
        //     'lineups.*.gender' => 'required|string',
        //     'lineups.*.upper_size' => 'required|string',
        //     'lineups.*.lower_size' => 'required|string',
        //     // add other lineup fields validations as required
        // ]);

        // dd($request->all());

        
       

        $total_price = 0;

        $order = Order::create([
            'team_name' => $request['team_name'],
             'due_date' => $request['due_date'],
            'customer_id' => auth()->user()->id
        ]);

        ProductionDetails::create([
            'order_id' => $order->id,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('images/orders', 'public');
                $path = $file->move('images/orders', $file->getClientOriginalName());

                $order->files()->create([
                    'order_id' => $order->id,
                    'path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

      
        if($request->selectedDesign != null){
            $image_data = $request->input('selectedDesign');
            $image = str_replace('data:image/png;base64,', '', $image_data);
            $image = str_replace(' ', '+', $image);
            $image_content = base64_decode($image);
    
            $fileName = 'order_image_' . time() . '.png';
            $filePath = 'order_images/' . $fileName;
            
        $filePath = 'images/orders/' . $fileName;
        // Storage::disk('public')->put($filePath, $image_content);
        file_put_contents($filePath, $image_content);

            $order->files()->create([
                'order_id' => $order->id,
                'path' => $filePath,
                'file_name' => $fileName,
            ]);

            // dd('true');
        }

        if($request->selectedPic != null){
            $sourcePath = storage_path('app/public/'.$request->selectedPic);
        if (File::exists($sourcePath)) {

            $cleanedString = str_replace("designs/", "", $request->selectedPic);
            $destinationPath = public_path('images/orders/' . $order->id.$cleanedString);
            File::copy($sourcePath, $destinationPath);

            $order->files()->create([
                'order_id' => $order->id,
                'path' => $destinationPath,
                'file_name' => $order->id.$cleanedString,
            ]);

        } else {

            echo "Source image file not found";
        }
        }


        foreach ($request['products'] as $product) {
            $orderProduct = OrderProduct::create([
                'order_id' => $order->id,
                'product_id' => $product['id'],
                'subtotal' => $product['subtotal'],
            ]);

            // Process variations for this product
            foreach ($request['variations'] as $categoryId => $variationId) {

                $p = Products::with('categories')->find($product['id']);

                foreach($p->categories as $cat){
                    if($cat->id == $categoryId){
                        OrderVariation::create([
                            'order_id' => $order->id,
                            'product_id' => $orderProduct->id,
                            'variation_id' => $variationId,
                            'category_id' => $categoryId,
                        ]);
                    }
                }

            }

            foreach ($request['lineups'] as $lineup) {
                if($lineup['product'] == $product['id']){

                    $subtotal = $orderProduct->subtotal;
                    if($lineup['classification'] == 'Kid'){
                        $subtotal -= 50;
                    }
                    Lineup::create([
                        'order_id' => $order->id,
                        'product_id' => $lineup['product'],
                        'player_name' => $lineup['player_name'],
                        'player_details' => $lineup['player_details'] ?? '',
                        'classification' => $lineup['classification'],
                        'gender' => $lineup['gender'],
                        'upper_size' => $lineup['upper_size'] ?? '',
                        'lower_size' => $lineup['lower_size'] ?? '',
                        'price' => $subtotal,
                        'remarks' => $lineup['remarks'] ?? '',
                    ]);

                    $total_price += $subtotal;
                }
            }

            $order->total_price = $total_price;
            $order->update();
        }

        // foreach ($request['lineups'] as $lineup) {


        //     Lineup::create([
        //         'order_id' => $order->id,
        //         'product_id' => $lineup['product'],
        //         'player_name' => $lineup['player_name'],
        //         'player_details' => $lineup['player_details'] ?? '',
        //         'classification' => $lineup['classification'],
        //         'gender' => $lineup['gender'],
        //         'upper_size' => $lineup['upper_size'] ?? '',
        //         'lower_size' => $lineup['lower_size'] ?? '',
        //         'remarks' => $lineup['remarks'] ?? '',
        //     ]);
        // }


        // }

        $csr = User::where('dept_id', 2)->get();
        foreach($csr as $c){
            $notif = Notification::create([
                'user_id' => $c->id,
                'title' => 'New Order Placed',
                'message' => 'Order "'.$order->team_name.'" has been placed by one of the customers. Check it out.',
                'url' => '/employee/view-order/'.$order->id
            ]);

            SendNotif::dispatch($notif);
        }


        // dd('Tapos');
        return redirect()->route('orders.downpayment', $order->id); // Adjust as per your needs
    }

    public function cancel_order(Request $request, $id) {


        $order = Order::with('production')->find($id);
        $order->production->status = $request->status;
        $order->production->save();


        return to_route('dashboard')->with('success', 'Order Successfully Cancelled.');
    }

    public function approval ($id) {
        $order = Order::with('production', 'latestapproved')->find($id);
        if($order->latestapproved->status == 'Approved'){
            return redirect()->route('orders.show', $id);
        }

        return Inertia::render('Approval', ['order' => $order]);
    }

    public function approve (Request $request) {
        $approved = ApproveDesign::find($request->id);
        $approved->status = 'Approved';
        $approved->save();

        $order = Order::with('production')->find($approved->order_id);
        $order->production->note = 'Design Approved';
        $order->production->save();

        return to_route('dashboard')->with('success', 'Design Successfully Approved.');
    }

    public function reject (Request $request) {
        $approved = ApproveDesign::find($request->id);
        $approved->status = 'Rejected';
        $approved->save();

        $order = Order::with('production')->find($approved->order_id);
        $order->production->note = 'Design Rejected';
        $order->production->save();

        return to_route('dashboard')->with('success', 'Design Rejected');
    }


    public function exportPdf(Request $request)
    {

        $orders = Order::query();



        // dd($request->startDate);
        if ($request->filterStatus !== null) {
            $orders->whereHas('production', function ($query) use ($request) {
                $query->where('status', $request->filterStatus);
            });
        }

        if ($request->startDate !== null && $request->endDate !== null) {
            $startDate = Carbon::parse($request->startDate)->startOfDay();
            $endDate = Carbon::parse($request->endDate)->endOfDay();
            $orders->whereBetween('created_at', [$startDate, $endDate]);
        }

        // if ($request->has('showUserOrders') && $request->showUserOrders) {
        //     $orders->whereHas('employees', function ($query) use ($request) {
        //         $query->where('user_id', $request->auth_employee_id);
        //     });
        // }

        $orders = $orders->withCount('lineups')->get();

        // dd($orders);



        $pdfOptions = new Options();
$pdfOptions->set('isHtml5ParserEnabled', true);
$pdfOptions->set('isRemoteEnabled', true);
$dompdf = new Dompdf($pdfOptions);

// Load HTML content
$dompdf->loadHtml(View::make('orders.pdf', ['orders' => $orders])->render());

// Set paper size and orientation
$dompdf->setPaper('A4', 'portrait');

// Render the PDF
$dompdf->render();

// Output the generated PDF to the browser
return $dompdf->stream('orders.pdf', ['Attachment' => false]);
    }

    public function return ($id)
    {
        $order = Order::with('lineups.products', 'production')->find($id);

        // dd($order);
        return Inertia::render('Return', ['order' => $order]);
    }

    public function return_records(Request $request)
    {

        $requestData = $request->input('records');

        $orderId = 0;
        $count = 0;
        foreach ($requestData as $recordData) {

            $record = Lineup::find($recordData['id']);

            if ($record) {
                $record->status = 'Error';
                $record->note = $recordData['errorType'];
                $record->save();
                $count++;
            }

            
            $orderId = $record->order_id;
        }


        $users = Order::with('employees')->find($orderId);

        foreach ($users->employees as $user) {
            $notif = Notification::create([
                'user_id' => $user->user_id,
                'title' => ''.$count.' Errors Returned',
                'message' => 'Customer has returned '.$count.' order with errors',
                'url' => ''
            ]);
            SendNotif::dispatch($notif);
        }

        
        return to_route('dashboard');
    }

    public function lineup_edit($id) {
        $order = Order::with('products.products')->find($id);
        $lineup = Lineup::where('order_id', $id)->get();

        return Inertia::render('EditLineup', ['lineup' => $lineup, 'order' => $order]);
    }



    public function lineup_update(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'lineup' => 'required|array',
            'lineup.*.product_id' => 'required|exists:products,id',
            'lineup.*.player_name' => 'required|string|max:255',
            'lineup.*.player_details' => 'nullable|string|max:255',
            'lineup.*.classification' => 'required|string|max:255',
            'lineup.*.gender' => 'required|string|max:255',
            'lineup.*.upper_size' => 'required|string|max:255',
            'lineup.*.lower_size' => 'required|string|max:255',
            'lineup.*.remarks' => 'nullable|string|max:255',
            // 'lineup.*.price' => 'required|int',
        ]);

        $order = Order::findOrFail($request->order_id);
        $lineupData = $request->lineup;


        $lineupIds = array_filter(array_column($lineupData, 'id'), function($id) {
            return !is_null($id);
        });


        Lineup::where('order_id', $order->id)
            ->whereNotIn('id', $lineupIds)
            ->delete();
        // dd($lineupData);
        // Update existing lineups or create new ones
        foreach ($lineupData as $lineup) {
            // Log::info($lineup);

            Lineup::updateOrCreate(


                ['id' => $lineup['id'] ?? null],
                [
                    'order_id' => $lineup['order_id'],
                    'product_id' => $lineup['product_id'],
                    'player_name' => $lineup['player_name'],
                    'player_details' => $lineup['player_details'],
                    'classification' => $lineup['classification'],
                    'gender' => $lineup['gender'],
                    'upper_size' => $lineup['upper_size'],
                    'lower_size' => $lineup['lower_size'],
                    'price' => $lineup['price'],
                    'remarks' => $lineup['remarks']
                ]
            );
        }


        // Remove lineups that are not in the updated lineup data


            $price = Lineup::where('order_id', $request->order_id)->sum('price');

        $order->total_price = $price;
        $order->save();

        $lineupss = Lineup::where('order_id', $order->id)->get();
        dd($lineupss);
        return redirect()->route('orders.show', $order->id)->with('success', 'Lineup updated successfully.');
    }

    public function add_product($id) {
        $order = Order::findOrFail($id);
        $products = Products::with('categories.variation')->get();
        return Inertia::render('Order/SelectedProducts/AddProduct', ['products' => $products, 'order' => $order]);
    }

    public function store_product(Request $request) {
        foreach ($request['products'] as $product) {
            $orderProduct = OrderProduct::create([
                'order_id' => $request['order_id'],
                'product_id' => $product['id'],
                'subtotal' => $product['subtotal'],
            ]);

            // Process variations for this product
            foreach ($request['variations'] as $categoryId => $variationId) {

                $p = Products::with('categories')->find($product['id']);

                foreach($p->categories as $cat){
                    if($cat->id == $categoryId){
                        OrderVariation::create([
                            'order_id' => $request['order_id'],
                            'product_id' => $orderProduct->id,
                            'variation_id' => $variationId,
                            'category_id' => $categoryId,
                        ]);
                    }
                }

            }
            
        }

        return redirect()->route('orders.show', $request['order_id'])->with('success', 'New Product added.');
    }
}
