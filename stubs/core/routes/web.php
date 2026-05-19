<?php

use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CookieConsentController;
use App\Http\Controllers\Dev\ThemeEditorController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\NotificationController;
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

    // Notificações do usuário (JSON — consumido pelo bell dropdown).
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notificationRecipient}/read', [NotificationController::class, 'read'])
        ->middleware(['fingerprint', 'throttle:fingerprinted'])
        ->name('notifications.read');
    Route::post('notifications/{notificationRecipient}/action', [NotificationController::class, 'action'])
        ->middleware(['fingerprint', 'throttle:fingerprinted'])
        ->name('notifications.action');

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

// Admin — gestão de usuários, roles e notificações.
Route::middleware(['auth', 'verified', 'role:superadmin|admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        // Usuários e roles (apenas superadmin).
        Route::middleware('role:superadmin')->group(function (): void {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::put('users/{user}/roles', [UserController::class, 'updateRoles'])
                ->middleware('fingerprint')
                ->name('users.roles.update');
        });

        // Notificações (superadmin + admin).
        Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
        Route::get('notifications/create', [AdminNotificationController::class, 'create'])->name('notifications.create');
        Route::post('notifications', [AdminNotificationController::class, 'store'])
            ->middleware('fingerprint')
            ->name('notifications.store');
        Route::get('notifications/{notification}', [AdminNotificationController::class, 'show'])->name('notifications.show');
        Route::get('notifications/{notification}/edit', [AdminNotificationController::class, 'edit'])->name('notifications.edit');
        Route::put('notifications/{notification}', [AdminNotificationController::class, 'update'])
            ->middleware('fingerprint')
            ->name('notifications.update');
        Route::post('notifications/{notification}/dispatch', [AdminNotificationController::class, 'dispatch'])
            ->middleware('fingerprint')
            ->name('notifications.dispatch');
        Route::delete('notifications/{notification}', [AdminNotificationController::class, 'destroy'])
            ->middleware('fingerprint')
            ->name('notifications.destroy');
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
