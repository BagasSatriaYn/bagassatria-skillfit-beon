<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'due_id',
        'amount_paid',
        'payment_date'
    ];

    public function due()
    {
        return $this->belongsTo(Due::class);
    }
}