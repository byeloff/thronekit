<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\PersonalDataExport\Jobs\CreatePersonalDataExportJob;

final class PrivacyController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/privacy', [
            'anonymizedAt' => $user?->anonymized_at?->toIso8601String(),
        ]);
    }

    /**
     * Dispara um Job que gera ZIP com os dados pessoais do usuário e envia
     * por email com link assinado (handler do pacote). O usuário recebe o
     * arquivo em background — não bloqueia a UI.
     */
    public function exportData(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user === null) {
            abort(403);
        }

        dispatch(new CreatePersonalDataExportJob($user))->onQueue('exports');

        activity('user')
            ->causedBy($user)
            ->event('personal_data_export_requested')
            ->log('User requested personal data export.');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Personal data export queued.')]);

        return back();
    }

    /**
     * Direito ao esquecimento: anonimiza PII (name/email) + zera credenciais
     * e desloga. O registro permanece para preservar referências históricas
     * (activity log, terms acceptances, etc.).
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user === null) {
            abort(403);
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        activity('user')
            ->causedBy($user)
            ->event('account_anonymized')
            ->log('User anonymized their account.');

        $user->anonymize();

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
