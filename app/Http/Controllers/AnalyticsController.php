<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Lineup;
use App\Models\Order;
use App\Models\OrderVariation;
use App\Models\ProductionDetails;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    //

    public function sales()
    {
        $ordersCount = ProductionDetails::whereNotIn('status', ['Cancelled', 'Pending', 'Released'])->count();
        $earnings = Order::sum('total_price');
        $lineups = Lineup::count();
        $productCounts = Lineup::with('products')
    ->selectRaw('product_id, COUNT(*) as count, SUM(price) as total_price')
    ->join('products', 'lineups.product_id', '=', 'products.id') // Adjust this join based on your actual relationship
    ->groupBy('product_id')
    ->orderBy('count', 'desc')
    ->get();
        $orders = Order::with('production', 'employees.employee', 'products.products')
        ->withCount('products', 'lineups')
        ->whereHas('production', function ($query) {
            $query->where('status', '!=', 'Pending');
        })->get();
        $variations = OrderVariation::selectRaw('variation_id, COUNT(variation_id) as count')->groupBy('variation_id')->get();


        $results = OrderVariation::with(['category', 'variations'])
            ->selectRaw('variation_id, category_id, COUNT(variation_id) as count')
            ->groupBy('variation_id', 'category_id')
            ->get();

        $arrayResults = $results->toArray();

        $groupedByCategoryName = collect($arrayResults)->groupBy(function ($item) {
            return $item['category']['category_name'];
        });

        $groupedByCategoryAndVariation = $groupedByCategoryName->map(function ($items) {
            return $items
                ->groupBy(function ($item) {
                    return $item['variations']['variation_name'];
                })
                ->map(function ($variationItems) {
                    $totalCount = $variationItems->sum('count');
                    return ['count' => $totalCount];
                });
        });

        $arrayGroupedByCategoryAndVariation = $groupedByCategoryAndVariation->toArray();

        return response()->json(['sales' => $ordersCount, 'orders' => $orders, 'earnings' => $earnings, 'products' => $productCounts, 'lineups' => $lineups, 'variations' => $arrayGroupedByCategoryAndVariation]);
    }

    public function production_chart() {
        return Inertia::render('ProductionChart');
    }

    public function production()
{
    // Fetch errors with status 'Error'
    $errors = Lineup::where('status', 'Error')->get();
    
    // Group by status and count the number of occurrences
    $status = ProductionDetails::select('status', DB::raw('COUNT(*) as count'))
        ->groupBy('status')
        ->orderBy('count', 'desc')
        ->get();
    $orders = Order::with('production', 'employees.employee', 'products.products')
        ->withCount('products', 'lineups')
        ->whereHas('production', function ($query) {
            $query->where('status', '!=', 'Pending');
        })->get();
    // Fetch all equipment
    $equipment = Equipment::all();
    
    // Return status grouped and counted
    return response()->json([
        'status' => $status,
        'orders' => $orders,
        'equipment' => $equipment
    ]);
}

  

    public function variations_count()
    {
        $variations = OrderVariation::selectRaw('variation_id, COUNT(*) as count')->groupBy('category_id')->get();

        return response()->json(['variations' => $variations]);
    }

    public function counts()
    {
        return Inertia::render('Chart');
    }

    public function getOrdersPerMonth()
    {
        // Define an array of all months
        $allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Query to count orders per month
        $ordersPerMonth = Order::select(DB::raw('MONTH(created_at) as label'), DB::raw('COUNT(*) as count'))->groupBy('label')->get();

        // Map the results to an array keyed by month number
        $ordersPerMonth = $ordersPerMonth
            ->mapWithKeys(function ($item) {
                return [$item->label => $item->count];
            })
            ->all();

        // Create the final result with all months
        $result = [];
        foreach ($allMonths as $index => $month) {
            $monthNumber = $index + 1;
            $result[] = [
                'label' => $month,
                'count' => $ordersPerMonth[$monthNumber] ?? 0,
            ];
        }

        $top3Months = Order::select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))->groupBy('month')->orderBy('count', 'desc')->limit(3)->get();

        // Optionally, map month numbers to month names for top 3 months
        $top3Months = $top3Months->map(function ($item) {
            $item->month = date('F', mktime(0, 0, 0, $item->month, 1));
            return $item;
        });

        return response()->json(['data' => $result, 'top3Months' => $top3Months]);
    }
}
