<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\Compliance\TermsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TermsController extends Controller
{
    public function __construct(
        private readonly TermsService $terms,
    ) {}

    public function show(Request $request): Response
    {
        $current = $this->terms->current();
        $user = $request->user();

        $acceptance = null;

        if ($current !== null && $user !== null) {
            $accepted = $user->acceptedTerms()
                ->where('terms_and_conditions.id', $current->id)
                ->first();

            if ($accepted !== null) {
                $acceptance = [
                    'accepted_at' => $accepted->pivot->accepted_at,
                    'ip' => $accepted->pivot->ip,
                    'user_agent' => $accepted->pivot->user_agent,
                    'fingerprint_key' => $accepted->pivot->fingerprint_key,
                ];
            }
        }

        return Inertia::render('terms/show', [
            'terms' => $current ? [
                'slug' => $current->slug,
                'version' => $current->version,
                'locale' => $current->locale,
                'content' => $current->content,
                'published_at' => $current->published_at?->toIso8601String(),
            ] : null,
            'acceptance' => $acceptance,
        ]);
    }

    public function accept(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user === null) {
            abort(403);
        }

        $this->terms->accept($user, $request);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Terms accepted.')]);

        return redirect()->route('dashboard');
    }
}
