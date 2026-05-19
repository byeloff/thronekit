<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\FeatureFlag;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateFeatureFlagRequest;
use App\Http\Requests\Admin\UpdateUserFeatureFlagRequest;
use App\Models\User;
use App\Services\Admin\FeatureFlagService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeatureFlagController extends Controller
{
    public function __construct(private readonly FeatureFlagService $service) {}

    public function index(Request $request): Response
    {
        $selectedFlag = FeatureFlag::tryFrom($request->input('flag', ''));
        $search = (string) $request->input('search', '');

        return Inertia::render('admin/feature-flags/index', [
            'flags' => $this->service->allWithStats(),
            'selectedFlag' => $selectedFlag?->value,
            'search' => $search,
            'flagUsers' => Inertia::optional(fn () => $selectedFlag
                ? $this->service->usersForFlag($selectedFlag, $search)
                : null
            ),
        ]);
    }

    public function update(UpdateFeatureFlagRequest $request, string $flag): RedirectResponse
    {
        $featureFlag = FeatureFlag::from($flag);

        match ($request->validated('action')) {
            'activate_all' => $this->service->activateForEveryone($featureFlag),
            'deactivate_all' => $this->service->deactivateForEveryone($featureFlag),
            'purge' => $this->service->purge($featureFlag),
        };

        return back()->with('success', __('admin.feature_flags.updated'));
    }

    public function updateUser(UpdateUserFeatureFlagRequest $request, string $flag, User $user): RedirectResponse
    {
        $featureFlag = FeatureFlag::from($flag);

        match ($request->validated('action')) {
            'activate' => $this->service->activateForUser($featureFlag, $user),
            'deactivate' => $this->service->deactivateForUser($featureFlag, $user),
            'forget' => $this->service->forgetForUser($featureFlag, $user),
        };

        return back()->with('success', __('admin.feature_flags.user_updated'));
    }
}
