<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Due;
use App\Models\Payment;
use App\Models\Resident;

class DueController extends Controller
{
    public function index()
    {
        $dues = Due::with(['resident', 'house', 'payments'])->orderBy('due_month', 'desc')->get();
        return response()->json(['data' => $dues]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'start_month' => 'required',
            'kebersihan_months' => 'required|numeric|min:0',
            'satpam_months' => 'required|numeric|min:0',
            'amount_paid' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:belum,lunas',
        ]);

        $resident = Resident::findOrFail($request->resident_id);
        
        // Find current house
        $houseHistory = \App\Models\HouseHistory::where('resident_id', $resident->id)
            ->whereNull('end_date')
            ->first();

        if (!$houseHistory) {
            return response()->json(['message' => 'Penghuni ini tidak menempati rumah manapun saat ini.'], 400);
        }

        $totalAmountPaid = $request->amount_paid ?? 0;
        $remainingPayment = $totalAmountPaid;
        $paymentDate = $request->tanggal_bayar ?: now();
        $createdDues = [];

        // Collect all due types and months to create
        $duesToCreate = [];
        
        // Cleaning Dues
        for ($i = 0; $i < $request->kebersihan_months; $i++) {
            $duesToCreate[] = [
                'type' => 'cleaning',
                'month' => \Carbon\Carbon::parse($request->start_month)->addMonths($i)->format('Y-m') . '-01',
                'amount' => 15000
            ];
        }

        // Security Dues
        for ($i = 0; $i < $request->satpam_months; $i++) {
            $duesToCreate[] = [
                'type' => 'security',
                'month' => \Carbon\Carbon::parse($request->start_month)->addMonths($i)->format('Y-m') . '-01',
                'amount' => 100000
            ];
        }

        foreach ($duesToCreate as $d) {
            $existingDue = Due::where('house_id', $houseHistory->house_id)
                ->where('due_type', $d['type'])
                ->where('due_month', $d['month'])
                ->first();

            if (!$existingDue) {
                $due = Due::create([
                    'house_id' => $houseHistory->house_id,
                    'resident_id' => $resident->id,
                    'due_type' => $d['type'],
                    'due_month' => $d['month'],
                    'amount' => $d['amount'],
                    'status' => 'unpaid'
                ]);

                if ($remainingPayment > 0) {
                    $payAmount = min($remainingPayment, $due->amount);
                    Payment::create([
                        'due_id' => $due->id,
                        'amount_paid' => $payAmount,
                        'payment_date' => $paymentDate
                    ]);
                    $due->updateStatus();
                    $remainingPayment -= $payAmount;
                }

                $createdDues[] = $due->load('payments');
            }
        }

        if (count($createdDues) === 0) {
            return response()->json(['message' => 'Tagihan untuk periode tersebut sudah ada atau jumlah bulan 0.'], 400);
        }

        return response()->json(['message' => 'Data pembayaran berhasil disimpan', 'data' => $createdDues]);
    }

    public function show(string $id)
    {
        $due = Due::with(['resident', 'house', 'payments'])->findOrFail($id);
        return response()->json(['data' => $due]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'jenis_iuran' => 'required|in:satpam,kebersihan',
            'bulan' => 'required',
            'jumlah' => 'required|numeric',
            'amount_paid' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:belum,lunas',
        ]);

        $due = Due::findOrFail($id);
        $dueType = $request->jenis_iuran === 'satpam' ? 'security' : 'cleaning';
        $dueMonth = $request->bulan . '-01';
        $dbStatus = $request->status === 'lunas' ? 'paid' : 'unpaid';

        $due->update([
            'resident_id' => $request->resident_id,
            'due_type' => $dueType,
            'due_month' => $dueMonth,
            'amount' => $request->jumlah
        ]);

        if (isset($request->amount_paid)) {
            // Re-sync payments: for simplicity in update, we clear and re-add
            // In a real app, we might want to keep history, but for this test, replacing is easier
            $due->payments()->delete();
            
            if ($request->amount_paid > 0) {
                Payment::create([
                    'due_id' => $due->id,
                    'amount_paid' => $request->amount_paid,
                    'payment_date' => $request->tanggal_bayar ?: now()
                ]);
            }
        }
        
        $due->updateStatus();

        return response()->json(['message' => 'Data pembayaran berhasil diupdate', 'data' => $due]);
    }

    public function destroy(string $id)
    {
        $due = Due::findOrFail($id);
        $due->delete();
        return response()->json(['message' => 'Data pembayaran berhasil dihapus']);
    }
}
