<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserProjectController;
use App\Http\Controllers\UserMessageController;
use App\Http\Controllers\UserFileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::middleware('verified')->group(function () {

        Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/projects', [UserProjectController::class, 'index']);
        Route::get('/messages', [UserMessageController::class, 'index']);
        Route::get('/files', [UserFileController::class, 'index']);

        Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');
        Route::put('settings/password', [PasswordController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('user-password.update');

        Route::get('settings/appearance', function () {
            return Inertia::render('settings/appearance');
        })->name('appearance.edit');

        Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
            ->name('two-factor.show');
    });
});