<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    public function index()
    {
        // Bungkus dalam 'data' agar sesuai dengan fetch di React (res.data.data)
        return response()->json(['data' => Resident::latest()->get()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string',
            'status' => 'required|in:permanent,contract',
            'phone_number' => 'required|string',
            'is_married' => 'required', // Terima 1/0 atau true/false
            'ktp_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048' // Validasi file
        ]);

        if ($request->hasFile('ktp_photo')) {
            // Simpan file ke storage/app/public/residents
            $path = $request->file('ktp_photo')->store('residents', 'public');
            $data['ktp_photo'] = $path;
        }

        $resident = Resident::create($data);
        return response()->json(['data' => $resident], 201);
    }

    public function show($id)
    {
        $resident = Resident::findOrFail($id);
        return response()->json(['data' => $resident]);
    }

   public function update(Request $request, $id)
{
    $resident = Resident::findOrFail($id);

    // Tambahkan log untuk debugging jika masih gagal
    // \Log::info($request->all());

    $data = $request->validate([
        'full_name' => 'sometimes|required|string',
        'status' => 'sometimes|required|in:permanent,contract',
        'phone_number' => 'sometimes|required|string',
        'is_married' => 'sometimes',
        'ktp_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
    ]);

    if ($request->hasFile('ktp_photo')) {
        // Hapus foto lama jika ada di storage
        if ($resident->ktp_photo) {
            Storage::disk('public')->delete($resident->ktp_photo);
        }
        
        $path = $request->file('ktp_photo')->store('residents', 'public');
        $data['ktp_photo'] = $path;
    }

    public function update(Request $request, $id)
{
    $resident = Resident::findOrFail($id);

    $validated = $request->validate([
        'full_name' => 'sometimes|required|string|max:255',
        'status' => 'sometimes|required|in:permanent,contract',
        'phone_number' => 'sometimes|required|string',
        'is_married' => 'sometimes', // Jangan paksa boolean keras di sini karena dari FormData datang sebagai string '1'/'0'
        'ktp_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
    ]);

    if ($request->hasFile('ktp_photo')) {
        // Hapus file lama
        if ($resident->ktp_photo) {
            Storage::disk('public')->delete($resident->ktp_photo);
        }
        $path = $request->file('ktp_photo')->store('residents', 'public');
        $validated['ktp_photo'] = $path;
    }

    $resident->update($validated);
    return response()->json(['data' => $resident]);
}
}