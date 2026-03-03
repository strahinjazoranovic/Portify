<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('berichten', function () {
    return Inertia::render('berichten');
})->middleware(['auth', 'verified'])->name('berichten');

Route::get('bestanden', function () {
    return Inertia::render('bestanden');
})->middleware(['auth', 'verified'])->name('bestanden');

Route::get('notificaties', function () {
    return Inertia::render('notificaties');
})->middleware(['auth', 'verified'])->name('notificaties');

require __DIR__.'/settings.php';
