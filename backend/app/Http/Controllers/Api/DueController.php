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
            'status' => 'required|in:belum,lunas',
        ]);

        $resident = Resident::findOrFail($request->resident_id);
        
        // Find current house
        $houseHistory = \App\Models\HouseHistory::where('resident_id', $resident->id)
            ->whereNull('end_date')
            ->first();

        if (!$houseHistory) {
            return response()->json(['message' => 'Penghuni ini tidak menempati rumah manapun saat ini.'], 400);
        }

        $dbStatus = $request->status === 'lunas' ? 'paid' : 'unpaid';
        $paymentDate = $request->tanggal_bayar ?: now();
        $createdDues = [];

        // Loop for Kebersihan
        for ($i = 0; $i < $request->kebersihan_months; $i++) {
            $dueMonth = \Carbon\Carbon::parse($request->start_month)->addMonths($i)->format('Y-m') . '-01';
            
            $existingDue = Due::where('house_id', $houseHistory->house_id)
                ->where('due_type', 'cleaning')
                ->where('due_month', $dueMonth)
                ->first();

            if (!$existingDue) {
                $due = Due::create([
                    'house_id' => $houseHistory->house_id,
                    'resident_id' => $resident->id,
                    'due_type' => 'cleaning',
                    'due_month' => $dueMonth,
                    'amount' => 15000,
                    'status' => $dbStatus
                ]);
                $createdDues[] = $due;

                if ($dbStatus === 'paid') {
                    Payment::create([
                        'due_id' => $due->id,
                        'amount_paid' => $due->amount,
                        'payment_date' => $paymentDate
                    ]);
                }
            }
        }

        // Loop for Satpam
        for ($i = 0; $i < $request->satpam_months; $i++) {
            $dueMonth = \Carbon\Carbon::parse($request->start_month)->addMonths($i)->format('Y-m') . '-01';
            
            $existingDue = Due::where('house_id', $houseHistory->house_id)
                ->where('due_type', 'security')
                ->where('due_month', $dueMonth)
                ->first();

            if (!$existingDue) {
                $due = Due::create([
                    'house_id' => $houseHistory->house_id,
                    'resident_id' => $resident->id,
                    'due_type' => 'security',
                    'due_month' => $dueMonth,
                    'amount' => 100000,
                    'status' => $dbStatus
                ]);
                $createdDues[] = $due;

                if ($dbStatus === 'paid') {
                    Payment::create([
                        'due_id' => $due->id,
                        'amount_paid' => $due->amount,
                        'payment_date' => $paymentDate
                    ]);
                }
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
            'status' => 'required|in:belum,lunas',
        ]);

        $due = Due::findOrFail($id);
        $dueType = $request->jenis_iuran === 'satpam' ? 'security' : 'cleaning';
        $dueMonth = $request->bulan . '-01';
        $dbStatus = $request->status === 'lunas' ? 'paid' : 'unpaid';

        $due->update([
            'resident_id' => $request->resident_id,
            'due_type' => $dueType,
            'due_month' => $dueMonth,
            'amount' => $request->jumlah,
            'status' => $dbStatus
        ]);

        // Sync payments if changed to lunas
        if ($dbStatus === 'paid' && $due->payments()->count() === 0) {
            Payment::create([
                'due_id' => $due->id,
                'amount_paid' => $due->amount,
                'payment_date' => $request->tanggal_bayar ?: now()
            ]);
        } elseif ($dbStatus === 'unpaid') {
            $due->payments()->delete();
        }

        return response()->json(['message' => 'Data pembayaran berhasil diupdate', 'data' => $due]);
    }

    public function destroy(string $id)
    {
        $due = Due::findOrFail($id);
        $due->delete();
        return response()->json(['message' => 'Data pembayaran berhasil dihapus']);
    }
}
