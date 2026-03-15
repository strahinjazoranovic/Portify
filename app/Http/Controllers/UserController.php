<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Fetch all users that have the role User
        $users = User::where('role', 'User')->get();
        return response()->json($users);
    }
}
