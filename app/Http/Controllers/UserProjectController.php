<?php
namespace App\Http\Controllers;

use App\Models\UserProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProjectController extends Controller
{
    public function index()
    {
        $projects = UserProject::all();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'status'      => 'required|in:Not started,In development,In testing,Finished',
            'description' => 'required|string',
            'deadline'    => 'required|date',
            'progress'    => 'integer|min:0|max:100',
            'user_id'     => 'nullable|exists:users,id',
            // Let users only upload images with max 2048MB size
            'logo'        => 'nullable|image|max:2048',
        ]);

        // Save file path to \storage\app\public\logo
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = Storage::url($path);
        }

        $validated['progress'] = $validated['progress'] ?? 0;

        $project = UserProject::create($validated);

        return response()->json($project, 201);
    }
}
