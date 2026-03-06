<?php
namespace App\Http\Controllers;

use App\Models\UserFile;
use Illuminate\Http\Request;

class UserFileController extends Controller
{
    public function index()
    {
        $files = UserFile::all();
        return response()->json($files);
    }
}
