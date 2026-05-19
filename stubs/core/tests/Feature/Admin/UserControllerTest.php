<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(fn () => (new RoleSeeder)->run());

/* ──────────────────────────────────────────────────────────── index ── */

it('superadmin acessa a listagem de usuários', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $this->actingAs($superAdmin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('users')
            ->has('roles')
        );
});

it('não-superadmin é bloqueado na listagem', function () {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

it('visitante não autenticado é redirecionado', function () {
    $this->get(route('admin.users.index'))
        ->assertRedirect(route('login'));
});

it('busca por nome filtra usuários', function () {
    $superAdmin = User::factory()->create(['name' => 'Super Admin']);
    $superAdmin->assignRole(Role::SuperAdmin);

    User::factory()->create(['name' => 'João Silva']);
    User::factory()->create(['name' => 'Maria Souza']);

    $this->actingAs($superAdmin)
        ->get(route('admin.users.index', ['search' => 'João']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'João Silva')
        );
});

it('filtra usuários por role', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $b2bUser = User::factory()->create();
    $b2bUser->assignRole(Role::B2b);

    User::factory()->create()->assignRole(Role::B2c);

    $this->actingAs($superAdmin)
        ->get(route('admin.users.index', ['role' => 'b2b']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.email', $b2bUser->email)
        );
});

/* ──────────────────────────────────────────────────────── updateRoles ── */

it('superadmin atribui roles a um usuário', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $target = User::factory()->create();

    $this->actingAs($superAdmin)
        ->put(route('admin.users.roles.update', $target), [
            'roles' => ['admin', 'b2b'],
        ])
        ->assertRedirect();

    expect($target->fresh()->getRoleNames()->toArray())->toEqualCanonicalizing(['admin', 'b2b']);
});

it('syncRoles remove roles anteriores', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $target = User::factory()->create();
    $target->assignRole(Role::Admin);
    $target->assignRole(Role::B2b);

    $this->actingAs($superAdmin)
        ->put(route('admin.users.roles.update', $target), [
            'roles' => ['b2c'],
        ])
        ->assertRedirect();

    expect($target->fresh()->getRoleNames()->toArray())->toBe(['b2c']);
});

it('permite remover todas as roles (array vazio)', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $target = User::factory()->create();
    $target->assignRole(Role::Admin);

    $this->actingAs($superAdmin)
        ->put(route('admin.users.roles.update', $target), ['roles' => []])
        ->assertRedirect();

    expect($target->fresh()->getRoleNames())->toBeEmpty();
});

it('rejeita role inválida', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);
    $target = User::factory()->create();

    $this->actingAs($superAdmin)
        ->put(route('admin.users.roles.update', $target), [
            'roles' => ['hacker'],
        ])
        ->assertSessionHasErrors('roles.0');
});

it('não-superadmin não pode alterar roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin);
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->put(route('admin.users.roles.update', $target), ['roles' => ['b2c']])
        ->assertForbidden();
});
