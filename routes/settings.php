<?php
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserProjectController;
use App\Http\Controllers\UserMessageController;
use App\Http\Controllers\UserFileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    Route::redirect('settings', '/settings/profile');

    // Route for updating account
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::middleware('verified')->group(function () {

        // Route for deleting account
        Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Routes for projects
        Route::get('/projects', [UserProjectController::class, 'index']);
        Route::post('/projects', [UserProjectController::class, 'store']);
        Route::put('/projects/{project}', [UserProjectController::class, 'update']);
        Route::delete('/projects/{project}', [UserProjectController::class, 'destroy']);
                
        // Routes for mesesages
        Route::get('/messages', [UserMessageController::class, 'index']);

        // Routes for files
        Route::get('/files', [UserFileController::class, 'index']);
        Route::post('/files', [UserFileController::class, 'store']);
        Route::put('/files/{file}', [UserFileController::class, 'update']);
        Route::delete('/files/{file}', [UserFileController::class, 'destroy']);

        // Route for users
        Route::get('/users', [UserController::class, 'index']);
        
        // Routes for settings
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