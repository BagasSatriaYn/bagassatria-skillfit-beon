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
            'house_number' => 'required|unique:houses'
        ]);

        return House::create($data);
    }

    public function show($id)
    {
        return House::with('histories.resident')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $house = House::findOrFail($id);

        $house->update($request->all());

        return $house;
    }

    public function destroy($id)
    {
        House::destroy($id);
        return response()->json(['message' => 'deleted']);
    }
}