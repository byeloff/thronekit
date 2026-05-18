
// ── Compliance routes (added by ThroneKit) ────────────────────────────────────

use App\Http\Controllers\CookieConsentController;
use App\Http\Controllers\PrivacyController;
use App\Http\Controllers\TermsController;

Route::get('terms', [TermsController::class, 'show'])->name('terms.show');

Route::put('cookie-consent', [CookieConsentController::class, 'store'])
    ->middleware('throttle:30,1')
    ->name('cookie-consent.store');

Route::middleware(['auth', 'verified', 'terms.accepted'])->group(function () {
    Route::get('settings/privacy', [PrivacyController::class, 'show'])
        ->name('settings.privacy.show');

    Route::post('settings/privacy/export', [PrivacyController::class, 'exportData'])
        ->middleware('throttle:3,60')
        ->name('settings.privacy.export');

    Route::delete('settings/privacy', [PrivacyController::class, 'destroy'])
        ->middleware('throttle:5,60')
        ->name('settings.privacy.destroy');
});

Route::middleware('auth')
    ->post('terms/accept', [TermsController::class, 'accept'])
    ->name('terms.accept');

Route::personalDataExports('personal-data-exports');
