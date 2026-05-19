<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreAvatarRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileAvatarController extends Controller
{
    public function store(StoreAvatarRequest $request): RedirectResponse
    {
        $request->user()
            ->addMediaFromRequest('avatar')
            ->toMediaCollection('avatar');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.avatar_updated')]);

        return to_route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->clearMediaCollection('avatar');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('settings.avatar_removed')]);

        return to_route('profile.edit');
    }
}
