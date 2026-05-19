<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Enums\FeatureFlag;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

class FeatureFlagService
{
    /**
     * @return list<array{name: string, label: string, active_count: int, inactive_count: int, default_count: int, total_users: int}>
     */
    public function allWithStats(): array
    {
        $flagNames = array_column(FeatureFlag::cases(), 'value');
        $totalUsers = User::count();

        $stored = DB::table('features')
            ->select(
                'name',
                DB::raw("SUM(CASE WHEN value = 'true'  THEN 1 ELSE 0 END) AS active_count"),
                DB::raw("SUM(CASE WHEN value = 'false' THEN 1 ELSE 0 END) AS inactive_count"),
            )
            ->whereIn('name', $flagNames)
            ->groupBy('name')
            ->get()
            ->keyBy('name');

        return array_map(function (FeatureFlag $flag) use ($stored, $totalUsers): array {
            $row = $stored->get($flag->value);
            $active = (int) ($row?->active_count ?? 0);
            $inactive = (int) ($row?->inactive_count ?? 0);

            return [
                'name' => $flag->value,
                'label' => $flag->name,
                'active_count' => $active,
                'inactive_count' => $inactive,
                'default_count' => max(0, $totalUsers - $active - $inactive),
                'total_users' => $totalUsers,
            ];
        }, FeatureFlag::cases());
    }

    /**
     * Retorna usuários paginados com o status do flag para cada um.
     *
     * @return LengthAwarePaginator<array{id: int, name: string, email: string, flag_value: 'active'|'inactive'|'default'}>
     */
    public function usersForFlag(FeatureFlag $flag, string $search = ''): LengthAwarePaginator
    {
        $paginator = User::search($search)
            ->query(fn ($q) => $q->select('id', 'name', 'email')->orderBy('name'))
            ->paginate(15)
            ->withQueryString();

        $userIds = collect($paginator->items())->pluck('id');

        $scopes = $userIds->map(fn (int $id): string => User::class.'|'.$id);

        $stored = DB::table('features')
            ->where('name', $flag->value)
            ->whereIn('scope', $scopes)
            ->pluck('value', 'scope');

        $paginator->getCollection()->transform(function (User $user) use ($stored): array {
            $scope = User::class.'|'.$user->id;
            $raw = $stored->get($scope);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'flag_value' => match ($raw) {
                    'true' => 'active',
                    'false' => 'inactive',
                    default => 'default',
                },
            ];
        });

        return $paginator;
    }

    public function activateForEveryone(FeatureFlag $flag): void
    {
        Feature::activateForEveryone($flag->value);
    }

    public function deactivateForEveryone(FeatureFlag $flag): void
    {
        Feature::deactivateForEveryone($flag->value);
    }

    public function purge(FeatureFlag $flag): void
    {
        Feature::purge($flag->value);
    }

    public function activateForUser(FeatureFlag $flag, User $user): void
    {
        Feature::for($user)->activate($flag->value);
    }

    public function deactivateForUser(FeatureFlag $flag, User $user): void
    {
        Feature::for($user)->deactivate($flag->value);
    }

    public function forgetForUser(FeatureFlag $flag, User $user): void
    {
        Feature::for($user)->forget($flag->value);
    }
}
