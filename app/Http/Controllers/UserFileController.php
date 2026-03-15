<?php
namespace App\Http\Controllers;

use App\Models\UserFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserFileController extends Controller
{
    public function index()
    {
        $files = UserFile::all();
        return response()->json($files);
    }
 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'required|string',
            'user_id'     => 'nullable|exists:users,id',
            // Let users upload all files with max 10MB size
            'path' => 'nullable|file|max:10240',
        ]);

        // Save file path to \storage\app\public\path
        if ($request->hasFile('path')) {
            $path = $request->file('path')->store('path', 'public');
            $validated['path'] = Storage::url($path);
        }

        $file = UserFile::create($validated);

        return response()->json($file, 201);
    }
}
