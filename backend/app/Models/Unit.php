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

    public function agreements()
    {
        return $this->hasMany(RentalAgreement::class);
    }

    public function currentAgreement()
    {
        return $this->hasOne(RentalAgreement::class)->whereNull('end_date_actual');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
