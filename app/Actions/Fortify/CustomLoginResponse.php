<?php
namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomLoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        // Roles with user get sent to normal dashboard
        if ($user->role === 'User') {
            return redirect()->route('dashboard');
        // Roles with admin get sent to admin dashboard
        } else if ($user->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }
    }
}
