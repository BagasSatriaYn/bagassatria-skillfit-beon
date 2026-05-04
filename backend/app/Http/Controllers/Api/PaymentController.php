<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Due;

class PaymentController extends Controller
{
    public function pay(Request $request)
    {
        $data = $request->validate([
            'due_id' => 'required|exists:dues,id',
            'amount_paid' => 'required|numeric|min:1'
        ]);

        $due = Due::findOrFail($data['due_id']);

        // simpan pembayaran
        $payment = Payment::create([
            'due_id' => $due->id,
            'amount_paid' => $data['amount_paid']
        ]);

        // total pembayaran
        $totalPaid = $due->payments()->sum('amount_paid');

        // update status
        if ($totalPaid >= $due->amount) {
            $due->status = 'paid';
        } elseif ($totalPaid > 0) {
            $due->status = 'partial';
        }

        $due->save();

        return response()->json([
            'message' => 'Payment success',
            'status' => $due->status,
            'total_paid' => $totalPaid
        ]);
    }
}