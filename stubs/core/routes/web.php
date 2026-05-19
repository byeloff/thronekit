<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CookieConsentController;
use App\Http\Controllers\Dev\ThemeEditorController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PrivacyController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\TermsController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Páginas públicas de compliance (não exigem auth).
Route::get('terms', [TermsController::class, 'show'])->name('terms.show');
Route::get('privacy-policy', [PrivacyPolicyController::class, 'show'])->name('privacy-policy.show');

// Endpoint público — usuário não autenticado também precisa registrar consent.
Route::put('cookie-consent', [CookieConsentController::class, 'store'])
    ->middleware('throttle:30,1')
    ->name('cookie-consent.store');

Route::middleware(['auth', 'verified', 'terms.accepted'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('settings/privacy', [PrivacyController::class, 'show'])
        ->name('settings.privacy.show');

    // Throttle agressivo: exportação gera ZIP + envia email — 3 por hora por usuário.
    Route::post('settings/privacy/export', [PrivacyController::class, 'exportData'])
        ->middleware(['fingerprint', 'throttle:privacy-export'])
        ->name('settings.privacy.export');

    // Anonimização é irreversível — 5 tentativas por hora por IP.
    Route::delete('settings/privacy', [PrivacyController::class, 'destroy'])
        ->middleware(['fingerprint', 'throttle:privacy-destroy'])
        ->name('settings.privacy.destroy');
});

// Aceite de termos: o middleware exclui esta rota — deve ser acessível por
// usuário autenticado pendente de aceite.
Route::middleware(['auth', 'fingerprint'])
    ->post('terms/accept', [TermsController::class, 'accept'])
    ->name('terms.accept');

Route::put('locale', [LocaleController::class, 'update'])->name('locale.update');

// Admin — gestão de usuários e roles (apenas superadmin).
Route::middleware(['auth', 'verified', 'role:superadmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::put('users/{user}/roles', [UserController::class, 'updateRoles'])
            ->middleware('fingerprint')
            ->name('users.roles.update');
    });

// Download do ZIP de exportação de dados pessoais (link assinado, auth obrigatório).
Route::personalDataExports('personal-data-exports');

require __DIR__.'/settings.php';

// Ferramentas de desenvolvimento — disponíveis apenas em ambiente local.
if (app()->environment('local')) {
    Route::prefix('dev')->name('dev.')->group(function (): void {
        Route::get('theme-editor', [ThemeEditorController::class, 'index'])->name('theme-editor');
        Route::post('theme-editor', [ThemeEditorController::class, 'update'])->name('theme-editor.update');
    });
}

// [thronekit:notifications-routes]
