<?php

declare(strict_types=1);

use App\Enums\FeatureFlag;
use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Pennant\Feature;

uses(RefreshDatabase::class);

beforeEach(fn () => (new RoleSeeder)->run());

/* ───────────────────────────────────────────────────────────── index ── */

it('superadmin acessa a listagem de feature flags', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $this->actingAs($superAdmin)
        ->get(route('admin.feature-flags.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/feature-flags/index')
            ->has('flags')
            ->where('selectedFlag', null)
        );
});

it('admin sem role superadmin é bloqueado', function () {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin);

    $this->actingAs($admin)
        ->get(route('admin.feature-flags.index'))
        ->assertForbidden();
});

it('visitante não autenticado é redirecionado na listagem', function () {
    $this->get(route('admin.feature-flags.index'))
        ->assertRedirect(route('login'));
});

it('retorna estatísticas de flags corretamente', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $users = User::factory()->count(3)->create();
    Feature::for($users[0])->activate(FeatureFlag::NewDashboard->value);
    Feature::for($users[1])->deactivate(FeatureFlag::NewDashboard->value);

    $this->actingAs($superAdmin)
        ->get(route('admin.feature-flags.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('flags', fn ($flags) => $flags
                ->first(fn ($flag) => $flag
                    ->where('name', FeatureFlag::NewDashboard->value)
                    ->where('active_count', 1)
                    ->where('inactive_count', 1)
                    ->etc()
                )
            )
        );
});

it('selectedFlag é propagado quando flag é passada na URL', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $this->actingAs($superAdmin)
        ->get(route('admin.feature-flags.index', ['flag' => FeatureFlag::NewDashboard->value]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('selectedFlag', FeatureFlag::NewDashboard->value)
        );
});

/* ──────────────────────────────────────────────────────────── update ── */

it('superadmin ativa flag para todos os overrides existentes', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $user = User::factory()->create();
    Feature::for($user)->deactivate(FeatureFlag::NewDashboard->value);

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.update', FeatureFlag::NewDashboard->value), [
            'action' => 'activate_all',
        ])
        ->assertRedirect();

    expect(DB::table('features')
        ->where('name', FeatureFlag::NewDashboard->value)
        ->where('value', json_encode(false))
        ->exists()
    )->toBeFalse();
});

it('superadmin desativa flag para todos os overrides existentes', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $user = User::factory()->create();
    Feature::for($user)->activate(FeatureFlag::NewDashboard->value);

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.update', FeatureFlag::NewDashboard->value), [
            'action' => 'deactivate_all',
        ])
        ->assertRedirect();

    expect(DB::table('features')
        ->where('name', FeatureFlag::NewDashboard->value)
        ->where('value', json_encode(true))
        ->exists()
    )->toBeFalse();
});

it('superadmin purga todos os overrides', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $user = User::factory()->create();
    Feature::for($user)->activate(FeatureFlag::NewDashboard->value);

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.update', FeatureFlag::NewDashboard->value), [
            'action' => 'purge',
        ])
        ->assertRedirect();

    expect(DB::table('features')
        ->where('name', FeatureFlag::NewDashboard->value)
        ->count()
    )->toBe(0);
});

it('rejeita ação inválida no update global', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.update', FeatureFlag::NewDashboard->value), [
            'action' => 'invalid_action',
        ])
        ->assertSessionHasErrors('action');
});

it('admin sem superadmin não pode atualizar flag global', function () {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin);

    $this->actingAs($admin)
        ->patch(route('admin.feature-flags.update', FeatureFlag::NewDashboard->value), [
            'action' => 'activate_all',
        ])
        ->assertForbidden();
});

/* ─────────────────────────────────────────────────────── updateUser ── */

it('superadmin ativa flag para usuário específico', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $target = User::factory()->create();

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.users.update', [FeatureFlag::NewDashboard->value, $target]), [
            'action' => 'activate',
        ])
        ->assertRedirect();

    expect(Feature::for($target)->active(FeatureFlag::NewDashboard->value))->toBeTrue();
});

it('superadmin desativa flag para usuário específico', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $target = User::factory()->create();
    Feature::for($target)->activate(FeatureFlag::NewDashboard->value);

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.users.update', [FeatureFlag::NewDashboard->value, $target]), [
            'action' => 'deactivate',
        ])
        ->assertRedirect();

    expect(Feature::for($target)->active(FeatureFlag::NewDashboard->value))->toBeFalse();
});

it('superadmin esquece override de usuário', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole(Role::SuperAdmin);

    $target = User::factory()->create();
    Feature::for($target)->activate(FeatureFlag::NewDashboard->value);

    $this->actingAs($superAdmin)
        ->patch(route('admin.feature-flags.users.update', [FeatureFlag::NewDashboard->value, $target]), [
            'action' => 'forget',
        ])
        ->assertRedirect();

    expect(DB::table('features')
        ->where('name', FeatureFlag::NewDashboard->value)
        ->where('scope', User::class.'|'.$target->id)
        ->exists()
    )->toBeFalse();
});

it('admin sem superadmin não pode alterar override de usuário', function () {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin);

    $target = User::factory()->create();

    $this->actingAs($admin)
        ->patch(route('admin.feature-flags.users.update', [FeatureFlag::NewDashboard->value, $target]), [
            'action' => 'activate',
        ])
        ->assertForbidden();
});
