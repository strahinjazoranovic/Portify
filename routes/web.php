<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Auth\GoogleController;

// Routes accessible without login
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


// Routes for login with Google
Route::prefix('auth')->group(function () {
    Route::get('/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

// Routes protected by auth + verified middleware
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('berichten', function () {
        return Inertia::render('berichten');
    })->name('berichten');

    Route::get('bestanden', function () {
        return Inertia::render('bestanden');
    })->name('bestanden');

    Route::get('notificaties', function () {
        return Inertia::render('notificaties');
    })->name('notificaties');
});

// Include other route files
require __DIR__.'/settings.php';