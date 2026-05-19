<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final class PrivacyPolicyController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('privacy-policy/show', [
            'dpo' => config('privacy.dpo'),
            'controller' => config('privacy.controller'),
            'retention' => config('privacy.retention'),
        ]);
    }
}
