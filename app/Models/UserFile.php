<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFile extends Model
{
    protected $table = 'files';

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'logo',
    ];
}