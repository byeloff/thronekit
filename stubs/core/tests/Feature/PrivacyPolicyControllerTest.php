<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('exibe a política de privacidade para visitantes não autenticados', function () {
    $this->get(route('privacy-policy.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('privacy-policy/show')
            ->has('dpo')
            ->has('controller')
            ->has('retention')
        );
});

it('exibe a política de privacidade para usuários autenticados', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('privacy-policy.show'))
        ->assertOk();
});

it('retorna dados do DPO na prop dpo', function () {
    $this->get(route('privacy-policy.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('dpo.name')
            ->has('dpo.title')
            ->has('dpo.email')
            ->has('dpo.phone')
            ->has('dpo.address')
        );
});

it('retorna dados de retenção na prop retention', function () {
    $this->get(route('privacy-policy.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('retention.activity_log_days')
            ->has('retention.personal_export_days')
            ->has('retention.account_after_anonymization_years')
        );
});
