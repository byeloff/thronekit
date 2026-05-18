<?php

declare(strict_types=1);

namespace App\Services\Compliance;

use App\Models\TermsAndCondition;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

/**
 * Orquestra leitura e aceitação dos Terms & Conditions.
 *
 * Slug canônico: `terms`. Outras políticas (privacy, cookies) podem reusar o
 * mesmo service trocando o slug.
 */
final class TermsService
{
    public const DEFAULT_SLUG = 'terms';

    /**
     * Versão publicada mais recente para o locale corrente (com fallback).
     */
    public function current(string $slug = self::DEFAULT_SLUG, ?string $locale = null): ?TermsAndCondition
    {
        $locale ??= App::getLocale();

        return TermsAndCondition::published()
            ->forSlug($slug)
            ->latestForLocale($locale)
            ->first();
    }

    /**
     * O usuário aceitou a versão atual (no slug informado)?
     */
    public function hasUserAcceptedCurrent(User $user, string $slug = self::DEFAULT_SLUG): bool
    {
        $current = $this->current($slug, $user->locale ?? App::getLocale());

        if ($current === null) {
            // Sem T&C publicada → nada a aceitar.
            return true;
        }

        return $user->acceptedTerms()
            ->where('terms_and_conditions.id', $current->id)
            ->exists();
    }

    /**
     * Registra aceite da versão atual para o usuário.
     */
    public function accept(User $user, Request $request, string $slug = self::DEFAULT_SLUG): ?TermsAndCondition
    {
        $current = $this->current($slug, $user->locale ?? App::getLocale());

        if ($current === null) {
            return null;
        }

        $user->acceptedTerms()->syncWithoutDetaching([
            $current->id => [
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 255),
                'accepted_at' => now(),
            ],
        ]);

        return $current;
    }
}
