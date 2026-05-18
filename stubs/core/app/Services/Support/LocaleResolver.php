<?php

declare(strict_types=1);

namespace App\Services\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

/**
 * Resolve o locale da requisição com prioridade: session → user.locale → cookie → APP_LOCALE.
 * Garante que apenas locales listados em `config('locales.available')` sejam aceitos.
 */
final class LocaleResolver
{
    public function resolve(Request $request): string
    {
        /** @var list<string> $supported */
        $supported = config('locales.available');

        $locale = $this->fromSession($supported)
            ?? $this->fromUser($request, $supported)
            ?? $this->fromCookie($request, $supported)
            ?? App::getLocale();

        if (! in_array($locale, $supported, true)) {
            $locale = config('app.fallback_locale', 'pt_BR');
        }

        App::setLocale($locale);

        return $locale;
    }

    /**
     * @param  list<string>  $supported
     */
    private function fromSession(array $supported): ?string
    {
        $value = Session::get('locale');

        return is_string($value) && in_array($value, $supported, true) ? $value : null;
    }

    /**
     * @param  list<string>  $supported
     */
    private function fromUser(Request $request, array $supported): ?string
    {
        $user = $request->user();
        if ($user === null) {
            return null;
        }

        $value = $user->locale ?? null;
        if (! is_string($value) || ! in_array($value, $supported, true)) {
            return null;
        }

        if (! Session::has('locale')) {
            Session::put('locale', $value);
        }

        return $value;
    }

    /**
     * @param  list<string>  $supported
     */
    private function fromCookie(Request $request, array $supported): ?string
    {
        $value = $request->cookie('locale');

        return is_string($value) && in_array($value, $supported, true) ? $value : null;
    }
}
