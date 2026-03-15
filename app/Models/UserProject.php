<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProject extends Model
{
    protected $table = 'projects';

    protected $fillable = [
        'name',
        'status',
        'description',
        'deadline',
        'progress',
        'user_id',
        'logo',
    ];
}
