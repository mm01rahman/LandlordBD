<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
    
    public function buildings()
    {
        return $this->hasMany(Building::class);
    }

    public function tenants()
    {
        return $this->hasMany(Tenant::class);
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
