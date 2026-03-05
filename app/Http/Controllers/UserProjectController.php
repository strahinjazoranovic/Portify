<?php
namespace App\Http\Controllers;

use App\Models\UserProject;
use Illuminate\Http\Request;

class UserProjectController extends Controller
{
    public function index()
    {
        $projects = UserProject::all();
        return response()->json($projects);
    }
}
