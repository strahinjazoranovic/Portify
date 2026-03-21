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
 
    // Store files
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'required|string',
            'user_id'     => 'nullable|exists:users,id',
            // Let users store files with max 10MB size
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

    // Update files
    public function update(Request $request, $file)
    {
        $file = UserFile::findOrFail($file);

        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'required|string',
            'user_id'     => 'nullable|exists:users,id',
            'path'        => 'nullable|file|max:10240',
        ]);

        // If new file uploaded → delete old one first
        if ($request->hasFile('path')) {
            if ($file->path) {
                $oldPath = str_replace('/storage/', '', $file->path);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('path')->store('path', 'public');
            $validated['path'] = Storage::url($path);
        }

        $file->update($validated);

        return response()->json($file);
    }

    // Destroy/delete an file
    public function destroy($file)
    {
        $file = UserFile::findOrFail($file);

        // Delete stored file if it exists in storage
        if ($file->path) {
            $path = str_replace('/storage/', '', $file->path);
            Storage::disk('public')->delete($path);
        }

        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}
