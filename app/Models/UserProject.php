<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
 
class UserProject extends Model
{
    // Specify the database table name
    protected $table = 'projects';

    // Define which fields can be mass assigned and are protected
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