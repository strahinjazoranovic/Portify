<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class UserFile extends Model
{
    // Specify the database table name
    protected $table = 'files';

    // Define which fields can be mass assigned and are protected
    protected $fillable = [
        'name',
        'description',
        'user_id',
        'logo',
    ];
}