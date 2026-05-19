<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role as RoleModel;

uses(RefreshDatabase::class);

it('seeds all four roles', function () {
    $this->seed(RoleSeeder::class);

    foreach (Role::cases() as $role) {
        expect(RoleModel::where('name', $role->value)->exists())->toBeTrue();
    }
});

it('is idempotent — running twice does not duplicate roles', function () {
    $this->seed(RoleSeeder::class);
    $this->seed(RoleSeeder::class);

    expect(RoleModel::count())->toBe(count(Role::cases()));
});

it('factory withRole assigns role to user', function () {
    $this->seed(RoleSeeder::class);

    $user = User::factory()->withRole(Role::Admin)->create();

    expect($user->hasRole(Role::Admin))->toBeTrue();
    expect($user->hasRole(Role::B2c))->toBeFalse();
});
