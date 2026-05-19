<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLocaleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

final class LocaleController extends Controller
{
    /**
     * Persiste o locale escolhido em session, cookie (1 ano) e na coluna users.locale (se logado).
     */
    public function update(UpdateLocaleRequest $request): RedirectResponse
    {
        $locale = $request->string('locale')->toString();

        Session::put('locale', $locale);
        Cookie::queue('locale', $locale, minutes: 60 * 24 * 365);

        $user = $request->user();
        if ($user !== null) {
            $user->forceFill(['locale' => $locale])->save();
        }

        return back();
    }
}
