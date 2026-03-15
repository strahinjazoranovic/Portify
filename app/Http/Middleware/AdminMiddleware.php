<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If the user isn't admin and he tries to access /admin/dashboard he will get an 403 error
        if (! $user || $user->role !== 'Admin') {
            abort(403);
        }

        return $next($request);
    }
}
