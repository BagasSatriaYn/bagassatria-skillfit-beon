<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::orderBy('expense_date', 'desc')->get();
        return response()->json(['data' => $expenses]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'expense_category' => 'required|string',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
        ]);

        $expense = Expense::create([
            'expense_category' => $request->expense_category,
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        return response()->json(['message' => 'Pengeluaran berhasil ditambahkan', 'data' => $expense]);
    }

    public function destroy(string $id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json(['message' => 'Pengeluaran berhasil dihapus']);
    }
}
