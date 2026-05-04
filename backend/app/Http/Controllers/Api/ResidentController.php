<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index()
    {
        return Resident::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required',
            'status' => 'required|in:permanent,contract',
            'phone_number' => 'required',
            'is_married' => 'boolean'
        ]);

        return Resident::create($data);
    }

    public function show($id)
    {
        return Resident::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $resident = Resident::findOrFail($id);

        $resident->update($request->all());

        return $resident;
    }

    public function destroy($id)
    {
        Resident::destroy($id);
        return response()->json(['message' => 'deleted']);
    }
}