<?php
namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\UserProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProjectController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Fetch projects based on user role: Admins can see all projects and users can only see their linked projects
        $projects = $user->role === 'Admin'
            // Fetch everything for admin
            ? UserProject::all()
            // Fetch everything that has the user_id of the logged in user
            : UserProject::where('user_id', $user->id)->get();

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

        // Notify the linked user
        if (!empty($validated['user_id'])) {
            AppNotification::notify(
                (int) $validated['user_id'],
                'project_created',
                'Nieuw project toegevoegd',
                "Het project \"{$project->name}\" is aan je toegewezen."
            );
        }
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

        // Notify the linked user about the edit
        if ($project->user_id) {
            AppNotification::notify(
                (int) $project->user_id,
                'project_updated',
                'Project bijgewerkt',
                "Het project \"{$project->name}\" is bijgewerkt."
            );
        }
    }

    // Public function for destroying(deleting) an project
    public function destroy($project)
    {
        $project = UserProject::findOrFail($project);
        $projectName = $project->name;
        $userId = $project->user_id;

        if ($project->logo) {
            $path = str_replace('/storage/', '', $project->logo);
            Storage::disk('public')->delete($path);
        }

        $project->delete();

        // Notify the linked user about the deletion
        if ($userId) {
            AppNotification::notify(
                (int) $userId,
                'project_deleted',
                'Project verwijderd',
                "Het project \"{$projectName}\" is verwijderd."
            );
        }
    }
}
