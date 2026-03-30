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

        // Roles with admin get sent to admin dashboard
        if ($user->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }

        // All other users(with role === 'User') get redirected to the normal dashboard
        return redirect()->route('dashboard');
    }
}
