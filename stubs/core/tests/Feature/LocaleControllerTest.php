<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('persiste locale na sessão e no cookie para visitante', function () {
    $this->put(route('locale.update'), ['locale' => 'en'])
        ->assertRedirect()
        ->assertSessionHas('locale', 'en');
});

it('persiste locale na coluna users.locale para usuário logado', function () {
    $user = User::factory()->create(['locale' => 'pt_BR']);

    $this->actingAs($user)
        ->put(route('locale.update'), ['locale' => 'en'])
        ->assertRedirect();

    expect($user->fresh()->locale)->toBe('en');
});

it('rejeita locale inválido', function () {
    $this->put(route('locale.update'), ['locale' => 'zh_CN'])
        ->assertSessionHasErrors('locale');
});

it('rejeita payload sem locale', function () {
    $this->put(route('locale.update'), [])
        ->assertSessionHasErrors('locale');
});

it('aceita todos os locales disponíveis', function () {
    $locales = config('locales.available');

    foreach ($locales as $locale) {
        $this->put(route('locale.update'), ['locale' => $locale])
            ->assertRedirect();
    }
});
