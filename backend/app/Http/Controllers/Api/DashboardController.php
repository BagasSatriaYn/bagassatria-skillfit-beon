<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Models\Due;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Saldo Sisa (Total Income - Total Expense)
        $totalIncome = Due::where('status', 'paid')->sum('amount');
        $totalExpense = Expense::sum('amount');
        $saldoSisa = $totalIncome - $totalExpense;

        // Pemasukan Bulan Ini
        $pemasukanBulanIni = Due::where('status', 'paid')
            ->whereMonth('due_month', $currentMonth)
            ->whereYear('due_month', $currentYear)
            ->sum('amount');

        // Pengeluaran Bulan Ini
        $pengeluaranBulanIni = Expense::whereMonth('expense_date', $currentMonth)
            ->whereYear('expense_date', $currentYear)
            ->sum('amount');

        // Rumah Dihuni
        $rumahDihuni = House::where('status', 'occupied')->count();

        // Chart Data (12 Bulan untuk Tahun Ini)
        $chartPemasukan = array_fill(0, 12, 0);
        $chartPengeluaran = array_fill(0, 12, 0);

        // Ambil pemasukan per bulan
        $incomes = Due::select(
                DB::raw('MONTH(due_month) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->where('status', 'paid')
            ->whereYear('due_month', $currentYear)
            ->groupBy('month')
            ->get();

        foreach ($incomes as $income) {
            $chartPemasukan[$income->month - 1] = (int) $income->total;
        }

        // Ambil pengeluaran per bulan
        $expenses = Expense::select(
                DB::raw('MONTH(expense_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->whereYear('expense_date', $currentYear)
            ->groupBy('month')
            ->get();

        foreach ($expenses as $expense) {
            $chartPengeluaran[$expense->month - 1] = (int) $expense->total;
        }

        $totalRumah = \App\Models\House::count();
        $rumahKosong = \App\Models\House::where('status', 'empty')->count();

        return response()->json([
            'data' => [
                'saldo_sisa' => $saldoSisa,
                'total_pemasukan_bulan_ini' => $pemasukanBulanIni,
                'total_pengeluaran_bulan_ini' => $pengeluaranBulanIni,
                'rumah_dihuni' => $rumahDihuni,
                'rumah_kosong' => $rumahKosong,
                'total_rumah' => $totalRumah,
                'chart_pemasukan' => $chartPemasukan,
                'chart_pengeluaran' => $chartPengeluaran,
            ]
        ]);
    }
}
