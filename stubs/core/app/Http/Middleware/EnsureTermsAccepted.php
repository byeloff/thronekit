<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\Compliance\TermsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bloqueia usuário autenticado que ainda não aceitou a versão vigente dos
 * Terms & Conditions, redirecionando para `/terms`. Não aplica em rotas
 * isentas (logout, /terms, /locale, broadcasting auth, etc.) — registradas
 * em `$except`.
 */
final class EnsureTermsAccepted
{
    /** @var list<string> */
    private array $except = [
        'logout',
        'terms.show',
        'terms.accept',
        'locale.update',
        'cookie-consent.store',
    ];

    public function __construct(
        private readonly TermsService $terms,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        $routeName = (string) ($request->route()?->getName() ?? '');
        if (in_array($routeName, $this->except, true) || str_starts_with($routeName, 'broadcasting.')) {
            return $next($request);
        }

        if ($this->terms->hasUserAcceptedCurrent($user)) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return redirect()->route('terms.show')->with('status', 'terms-acceptance-required');
        }

        return redirect()->route('terms.show');
    }
}
