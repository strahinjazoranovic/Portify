<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Auth\GoogleController;


// Public Routes
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Google OAuth Login
Route::prefix('auth')->group(function () {
    Route::get('/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

// Protected user routes
Route::middleware(['auth', 'verified'])->group(function () {

    // Regular User Dashboard
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

// Protected admin routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::get('/admin/berichten', function () {
        return Inertia::render('admin/berichten');
    })->name('admin.berichten');

    Route::get('/admin/bestanden', function () {
        return Inertia::render('admin/bestanden');
    })->name('admin.bestanden');

    Route::get('/admin/notificaties', function () {
        return Inertia::render('admin/notificaties');
    })->name('admin.notificaties');
});

require __DIR__.'/settings.php';