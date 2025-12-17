<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = [
        'building_id', 'unit_number', 'floor', 'type', 'rent_amount', 'status'
    ];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }
}
