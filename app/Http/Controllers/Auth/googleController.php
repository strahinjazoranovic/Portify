<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

   public function handleGoogleCallback()
    {
        \Log::info('Google callback route reached');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            /*
            You could use the code below to disable SSL verification for the Google provider if the code above doesn't work,
            but be cautious when doing this in a production environment as it can expose you to security risks.
            
                $googleUser = Socialite::driver('google')
                ->stateless()
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]));
                ->user();
            */

            \Log::info('Google user retrieved', [
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect('/login')->withErrors('Google login failed.');
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'password' => bcrypt(str()->random(16)),
                'email_verified_at' => now(),
            ]
        );

        \Log::info('User logged in', ['user_id' => $user->id]);

        Auth::login($user, true);
        if ($user->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->intended('/dashboard');
    }
}