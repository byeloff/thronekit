<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCookieConsentRequest;
use App\Services\Support\CookieConsentState;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cookie;

/**
 * Registra a escolha do usuário sobre cookies em três categorias:
 *  - essential (sempre true, exigido pra operar)
 *  - analytics
 *  - marketing
 *
 * Salva tudo num único cookie JSON `cookie_consent` válido por 12 meses
 * (limite recomendado LGPD/GDPR). Log auditável via activity log quando
 * houver usuário autenticado.
 */
final class CookieConsentController extends Controller
{
    public function store(StoreCookieConsentRequest $request): RedirectResponse
    {
        $payload = CookieConsentState::payload(
            analytics: (bool) $request->boolean('analytics'),
            marketing: (bool) $request->boolean('marketing'),
        );

        Cookie::queue(
            cookie()->make(
                name: 'cookie_consent',
                value: json_encode($payload, JSON_THROW_ON_ERROR),
                minutes: 60 * 24 * 365,
                httpOnly: false,
            ),
        );

        if ($user = $request->user()) {
            activity('user')
                ->causedBy($user)
                ->event('cookie_consent_updated')
                ->withProperties($payload)
                ->log('User updated cookie consent.');
        }

        return back();
    }
}
