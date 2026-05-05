<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = ['house_number', 'status'];

    public function histories()
    {
        return $this->hasMany(HouseHistory::class);
    }

    public function dues()
    {
        return $this->hasMany(Due::class);
    }

    public function currentResident()
    {
        return $this->hasOne(HouseHistory::class)
            ->whereNull('end_date');
    }
}
