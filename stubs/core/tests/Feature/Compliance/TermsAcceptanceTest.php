<?php

declare(strict_types=1);

use App\Models\TermsAndCondition;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createPublishedTerms(): TermsAndCondition
{
    return TermsAndCondition::create([
        'slug' => 'terms',
        'version' => '1.0',
        'locale' => 'pt_BR',
        'content' => 'Conteúdo de teste.',
        'published_at' => now()->subMinute(),
    ]);
}

it('redirects to dashboard after accepting terms', function () {
    createPublishedTerms();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('terms.accept'))
        ->assertRedirect(route('dashboard'));
});

it('flashes a success toast after accepting terms', function () {
    createPublishedTerms();
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('terms.accept'));

    $flash = session('inertia.flash_data');
    expect($flash['toast'])->toMatchArray(['type' => 'success']);
});

it('records the acceptance in the database', function () {
    $terms = createPublishedTerms();
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('terms.accept'));

    $this->assertDatabaseHas('user_terms_acceptances', [
        'user_id' => $user->id,
        'terms_and_condition_id' => $terms->id,
    ]);
});

it('redirects unauthenticated user to login', function () {
    $this->post(route('terms.accept'))->assertRedirect(route('login'));
});
