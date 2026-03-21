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

    // Store/create an project
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
    }

    // Update projects
    public function update(Request $request, $project)
    {
        $project = UserProject::findOrFail($project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'deadline' => 'required|date',
            'status' => 'required|string',
            'user_id' => 'nullable|exists:users,id',
            'logo' => 'nullable|image|max:2048',
            'progress' => 'integer|min:0|max:100',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = Storage::url($path);
        }

        $project->update($validated);
    }

    // Public function for destroying(deleting) an project
    public function destroy($project)
    {
        $project = UserProject::findOrFail($project);

        if ($project->logo) {
            $path = str_replace('/storage/', '', $project->logo);
            Storage::disk('public')->delete($path);
        }

        $project->delete();
    }
}
