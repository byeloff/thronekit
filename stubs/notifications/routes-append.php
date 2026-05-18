
// ── Notifications routes (added by ThroneKit) ─────────────────────────────────

use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\NotificationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notificationRecipient}/read', [NotificationController::class, 'read'])->name('notifications.read');
    Route::post('notifications/{notificationRecipient}/action', [NotificationController::class, 'action'])->name('notifications.action');
});

Route::middleware(['auth', 'verified', 'role:superadmin|admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
        Route::get('notifications/create', [AdminNotificationController::class, 'create'])->name('notifications.create');
        Route::post('notifications', [AdminNotificationController::class, 'store'])->name('notifications.store');
        Route::get('notifications/{notification}', [AdminNotificationController::class, 'show'])->name('notifications.show');
        Route::get('notifications/{notification}/edit', [AdminNotificationController::class, 'edit'])->name('notifications.edit');
        Route::put('notifications/{notification}', [AdminNotificationController::class, 'update'])->name('notifications.update');
        Route::post('notifications/{notification}/dispatch', [AdminNotificationController::class, 'dispatch'])->name('notifications.dispatch');
        Route::delete('notifications/{notification}', [AdminNotificationController::class, 'destroy'])->name('notifications.destroy');
    });
