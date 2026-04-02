<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    // Redirect the user to Google's OAuth authentication page.
    public function redirectToGoogle()
    {
        // Uses Laravel Socialite to redirect user to Google login
        return Socialite::driver('google')->redirect();
    }

    // Handle the callback from Google after authentication.
    public function handleGoogleCallback()
    {
        // Log that the callback route has been hit (useful for debugging)
        \Log::info('Google callback route reached');

        try {
            // Retrieve the authenticated user from Google
            // stateless() disables session state (useful for APIs or SPA setups)
            $googleUser = Socialite::driver('google')->stateless()->user();

            /*
            Alternative (NOT recommended for production):
            This disables SSL verification, which can help in local/dev environments
            if you face certificate issues, but it is insecure for production use.
            
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
                ->user();
            */

            // Log retrieved user details for debugging
            \Log::info('Google user retrieved', [
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
            ]);

        } catch (\Exception $e) {
            // Log any errors that occur during Google authentication
            \Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Redirect back to login page with error message
            return redirect('/login')->withErrors('Google login failed.');
        }

        // Find existing user by email or create a new one
        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()], // Lookup condition
            [
                'name' => $googleUser->getName(), // Set name from Google
                'password' => bcrypt(str()->random(16)), // Generate random password
                'email_verified_at' => now(), // Mark email as verified
            ]
        );

        // Log successful login
        \Log::info('User logged in', ['user_id' => $user->id]);

        // Log the user into Laravel (remember = true for persistent login)
        Auth::login($user, true);

        // Redirect based on user role
        if ($user->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }

        // Default redirect to intended page or dashboard
        return redirect()->intended('/dashboard');
    }
}