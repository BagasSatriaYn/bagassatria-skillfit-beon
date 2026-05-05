<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Due extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'due_type',
        'due_month',
        'amount',
        'status'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function updateStatus()
    {
        $totalPaid = $this->payments()->sum('amount_paid');

        if ($totalPaid >= $this->amount) {
            $this->status = 'paid';
        } elseif ($totalPaid > 0) {
            $this->status = 'partial';
        } else {
            $this->status = 'unpaid';
        }

        $this->save();
    }
}
