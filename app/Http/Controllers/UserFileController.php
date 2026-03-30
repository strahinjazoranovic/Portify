<?php
namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\UserFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserFileController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Fetch projects based on user role: Admins can see all projects and users can only see their linked projects
        $files = $user->role === 'Admin'
            // Fetch everything for admin
            ? UserFile::all()
            // Fetch everything that has the user_id of the logged in user
            : UserFile::where('user_id', $user->id)->get();

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

        // Notify the linked user
        if (!empty($validated['user_id'])) {
            AppNotification::notify(
                (int) $validated['user_id'],
                'file_created',
                'Nieuw bestand toegevoegd',
                "Het bestand \"{$file->name}\" is aan je toegewezen."
            );
        }

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

        // Notify the linked user about the edit
        if ($file->user_id) {
            AppNotification::notify(
                (int) $file->user_id,
                'file_updated',
                'Bestand bijgewerkt',
                "Het bestand \"{$file->name}\" is bijgewerkt."
            );
        }

        return response()->json($file);
    }

    // Destroy/delete an file
    public function destroy($file)
    {
        $file = UserFile::findOrFail($file);
        $fileName = $file->name;
        $userId = $file->user_id;

        // Delete stored file if it exists in storage
        if ($file->path) {
            $path = str_replace('/storage/', '', $file->path);
            Storage::disk('public')->delete($path);
        }

        $file->delete();

        // Notify the linked user about the deletion
        if ($userId) {
            AppNotification::notify(
                (int) $userId,
                'file_deleted',
                'Bestand verwijderd',
                "Het bestand \"{$fileName}\" is verwijderd."
            );
        }

        return response()->json(['message' => 'File deleted successfully']);
    }
}
