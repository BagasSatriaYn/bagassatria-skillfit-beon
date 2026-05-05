<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index()
    {
        return House::with('currentResident.resident')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'house_number' => 'required|unique:houses',
            'status' => 'required|in:occupied,empty',
            'resident_id' => 'required_if:status,occupied|nullable|exists:residents,id'
        ]);

        $house = House::create([
            'house_number' => $data['house_number'],
            'status' => $data['status']
        ]);

        if ($data['status'] === 'occupied' && !empty($data['resident_id'])) {
            $house->histories()->create([
                'resident_id' => $data['resident_id'],
                'start_date' => now()->toDateString()
            ]);
        }

        return $house;
    }

    public function show($id)
    {
        return House::with(['histories.resident', 'dues.resident'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $house = House::findOrFail($id);

        $data = $request->validate([
            'house_number' => 'required|unique:houses,house_number,'.$id,
            'status' => 'required|in:occupied,empty',
            'resident_id' => 'required_if:status,occupied|nullable|exists:residents,id'
        ]);

        $house->update([
            'house_number' => $data['house_number'],
            'status' => $data['status']
        ]);

        $currentHistory = $house->currentResident;

        if ($data['status'] === 'occupied' && !empty($data['resident_id'])) {
            if (!$currentHistory || $currentHistory->resident_id != $data['resident_id']) {
                if ($currentHistory) {
                    $currentHistory->update(['end_date' => now()->toDateString()]);
                }
                $house->histories()->create([
                    'resident_id' => $data['resident_id'],
                    'start_date' => now()->toDateString()
                ]);
            }
        } elseif ($data['status'] === 'empty') {
            if ($currentHistory) {
                $currentHistory->update(['end_date' => now()->toDateString()]);
            }
        }

        return $house;
    }

    public function destroy($id)
    {
        House::destroy($id);
        return response()->json(['message' => 'deleted']);
    }
}