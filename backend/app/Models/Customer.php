<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'customer_name',
        'customer_address',
        'gender',
        'birth_date',
    ];
}
