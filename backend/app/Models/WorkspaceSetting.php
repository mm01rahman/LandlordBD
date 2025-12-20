<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceSetting extends Model
{
    protected $fillable = [
        'user_id', 'name', 'language', 'timezone', 'currency'
    ];
}
