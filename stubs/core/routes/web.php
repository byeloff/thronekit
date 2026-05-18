<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PrivacyPolicyController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('privacy-policy', [PrivacyPolicyController::class, 'show'])->name('privacy-policy.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::put('locale', [LocaleController::class, 'update'])->name('locale.update');

// Admin — gestão de usuários e roles (apenas superadmin).
Route::middleware(['auth', 'verified', 'role:superadmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
        Route::put('users/{user}/roles', [\App\Http\Controllers\Admin\UserController::class, 'updateRoles'])->name('users.roles.update');
    });

require __DIR__.'/settings.php';

// [thronekit:compliance-routes]
// [thronekit:notifications-routes]
