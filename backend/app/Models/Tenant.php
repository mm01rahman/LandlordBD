<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'user_id', 'name', 'phone', 'whatsapp', 'email', 'address'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agreements()
    {
        return $this->hasMany(RentalAgreement::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}