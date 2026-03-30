<?php
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserProjectController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserFileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Protected API routes
Route::middleware('auth')->group(function () {

    // Redirect settings to /settings/profile
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
                
        // Routes for messages
        Route::get('/chat/users', [MessageController::class, 'getAvailableUsers']);
        Route::get('/chat/conversations', [MessageController::class, 'getConversations']);
        Route::get('/chat/messages/{id}', [MessageController::class, 'getMessages']);
        Route::post('/chat/start', [MessageController::class, 'startConversation']);
        Route::post('/chat/send', [MessageController::class, 'sendMessage']);
        Route::put('/chat/messages/{id}', [MessageController::class, 'editMessage']);
        Route::delete('/chat/messages/{id}', [MessageController::class, 'deleteMessage']);
        Route::post('/chat/messages/{id}/react', [MessageController::class, 'toggleReaction']);
        Route::post('/chat/read/{id}', [MessageController::class, 'markAsRead']);

        // Routes for files
        Route::get('/files', [UserFileController::class, 'index']);
        Route::post('/files', [UserFileController::class, 'store']);
        Route::put('/files/{file}', [UserFileController::class, 'update']);
        Route::delete('/files/{file}', [UserFileController::class, 'destroy']);

        // Routes for notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

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