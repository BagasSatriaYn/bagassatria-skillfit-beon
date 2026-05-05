<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Due;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function yearlyReport($year)
    {
        // 1. Total Income from dues where status = paid
        $totalIncome = Due::where('status', 'paid')
            ->whereYear('due_month', $year)
            ->sum('amount');

        // 2. Total Expense
        $totalExpense = Expense::whereYear('expense_date', $year)
            ->sum('amount');

        $balance = $totalIncome - $totalExpense;

        // 3. Monthly Summary for charts
        $monthly_summary = [];
        
        $incomes = Due::select(
            DB::raw('MONTH(due_month) as month'),
            DB::raw('SUM(amount) as total')
        )
        ->where('status', 'paid')
        ->whereYear('due_month', $year)
        ->groupBy('month')
        ->get()
        ->keyBy('month');

        $expenses = Expense::select(
            DB::raw('MONTH(expense_date) as month'),
            DB::raw('SUM(amount) as total')
        )
        ->whereYear('expense_date', $year)
        ->groupBy('month')
        ->get()
        ->keyBy('month');

        for ($i = 1; $i <= 12; $i++) {
            $monthly_summary[] = [
                'month' => $i,
                'income' => isset($incomes[$i]) ? (int) $incomes[$i]->total : 0,
                'expense' => isset($expenses[$i]) ? (int) $expenses[$i]->total : 0,
            ];
        }

        return response()->json([
            'data' => [
                'year' => (int) $year,
                'total_income' => (int) $totalIncome,
                'total_expense' => (int) $totalExpense,
                'balance' => (int) $balance,
                'monthly_summary' => $monthly_summary
            ]
        ]);
    }

    public function monthlyDetail($year, $month)
    {
        $expenses = Expense::whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->orderBy('expense_date', 'desc')
            ->get();

        return response()->json([
            'data' => [
                'expenses' => $expenses
            ]
        ]);
    }
}
