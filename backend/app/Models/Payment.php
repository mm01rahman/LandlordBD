<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'agreement_id', 'user_id', 'tenant_id', 'unit_id', 'billing_month', 'amount_due', 'amount_paid', 'status', 'payment_date', 'payment_method', 'notes'
    ];

    protected $casts = [
        'billing_month' => 'date',
        'payment_date' => 'date',
    ];

    public function agreement()
    {
        return $this->belongsTo(RentalAgreement::class, 'agreement_id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
