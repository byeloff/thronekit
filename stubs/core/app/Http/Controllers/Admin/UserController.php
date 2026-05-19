<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRolesRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $filters = request()->only(['search', 'role']);
        $search = $filters['search'] ?? '';
        $role = $filters['role'] ?? null;

        $users = User::search($search)
            ->query(function ($query) use ($role): void {
                $query->with('roles');

                if ($role !== null) {
                    $query->role($role);
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'roles' => array_column(Role::cases(), 'value'),
            'filters' => $filters,
        ]);
    }

    public function updateRoles(UpdateUserRolesRequest $request, User $user): RedirectResponse
    {
        $user->syncRoles($request->validated('roles'));

        return back()->with('success', __('admin.users.roles_updated'));
    }
}
