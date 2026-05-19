<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Spatie\Activitylog\Models\Activity;
use Spatie\PersonalDataExport\Jobs\CreatePersonalDataExportJob;

uses(RefreshDatabase::class);

/* ─────────────────────────────────────────────────────────────────── show ── */

it('exibe a página de privacidade com anonymizedAt null para usuário normal', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('settings.privacy.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('settings/privacy')
            ->where('anonymizedAt', null)
        );
});

it('exibe anonymizedAt preenchido após anonimização', function () {
    $user = User::factory()->create(['anonymized_at' => now()]);

    $this->actingAs($user)
        ->get(route('settings.privacy.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('anonymizedAt')
        );
});

it('redireciona visitante não autenticado para login', function () {
    $this->get(route('settings.privacy.show'))
        ->assertRedirect(route('login'));
});

/* ──────────────────────────────────────────────────────────── exportData ── */

it('dispara o job de exportação na fila exports', function () {
    Queue::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('settings.privacy.export'))
        ->assertRedirect();

    Queue::assertPushedOn('exports', CreatePersonalDataExportJob::class);
});

it('registra evento personal_data_export_requested no activity log', function () {
    Queue::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('settings.privacy.export'));

    expect(
        Activity::where('event', 'personal_data_export_requested')
            ->where('causer_id', $user->id)
            ->exists()
    )->toBeTrue();
});

it('flasha toast de sucesso após solicitar exportação', function () {
    Queue::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('settings.privacy.export'))
        ->assertSessionHas('inertia.flash_data');
});

it('exportação é negada a visitante não autenticado', function () {
    $this->post(route('settings.privacy.export'))
        ->assertRedirect(route('login'));
});

it('rate limit bloqueia após 3 exportações por hora', function () {
    Queue::fake();

    $user = User::factory()->create();

    for ($i = 0; $i < 3; $i++) {
        $this->actingAs($user)->post(route('settings.privacy.export'))->assertRedirect();
    }

    $this->actingAs($user)
        ->post(route('settings.privacy.export'))
        ->assertStatus(429);
});

/* ──────────────────────────────────────────────────────────────── destroy ── */

it('anonimiza o usuário com senha correta e desloga', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('settings.privacy.destroy'), ['password' => 'password'])
        ->assertRedirect('/');

    $user->refresh();
    expect($user->anonymized_at)->not->toBeNull();
    $this->assertGuest();
});

it('registra evento account_anonymized no activity log', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('settings.privacy.destroy'), ['password' => 'password']);

    expect(
        Activity::where('event', 'account_anonymized')
            ->where('causer_id', $user->id)
            ->exists()
    )->toBeTrue();
});

it('rejeita senha incorreta sem anonimizar', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('settings.privacy.destroy'), ['password' => 'wrong-password'])
        ->assertSessionHasErrors('password');

    $user->refresh();
    expect($user->anonymized_at)->toBeNull();
});

it('destroy é negado a visitante não autenticado', function () {
    $this->delete(route('settings.privacy.destroy'), ['password' => 'password'])
        ->assertRedirect(route('login'));
});
