<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentalAgreement extends Model
{
    protected $fillable = [
        'user_id', 'tenant_id', 'unit_id', 'start_date', 'end_date', 'end_date_actual', 'monthly_rent', 'security_deposit', 'status', 'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'end_date_actual' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

}