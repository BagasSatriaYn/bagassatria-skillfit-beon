<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HouseHistory;

class HouseAssignmentController extends Controller
{
    public function assign(Request $request)
    {
        $data = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'start_date' => 'required|date'
        ]);

        // 🔴 tutup penghuni lama (kalau ada)
        HouseHistory::where('house_id', $data['house_id'])
            ->whereNull('end_date')
            ->update([
                'end_date' => now()
            ]);

        // 🟢 insert penghuni baru
        $history = HouseHistory::create([
            'house_id' => $data['house_id'],
            'resident_id' => $data['resident_id'],
            'start_date' => $data['start_date']
        ]);

        return response()->json([
            'message' => 'Resident assigned to house',
            'data' => $history
        ]);
    }
}