<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\Support\LocaleResolver;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class Localization
{
    public function __construct(
        private readonly LocaleResolver $localeResolver,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $this->localeResolver->resolve($request);

        return $next($request);
    }
}
