<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Models\Due;
use App\Models\Expense;

class DashboardController extends Controller
{
    public function index()
    {
        $totalHouses = House::count();

        $occupied = House::whereHas('currentResident')->count();

        $empty = $totalHouses - $occupied;

        $totalIncome = Due::where('status', 'paid')->sum('amount');

        $totalExpense = Expense::sum('amount');

        $totalUnpaid = Due::where('status', '!=', 'paid')->sum('amount');

        return response()->json([
            'houses' => [
                'total' => $totalHouses,
                'occupied' => $occupied,
                'empty' => $empty
            ],
            'finance' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'unpaid' => $totalUnpaid
            ]
        ]);
    }
}
