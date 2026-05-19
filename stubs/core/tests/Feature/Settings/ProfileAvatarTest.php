<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
});

test('usuário autenticado pode fazer upload de avatar', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $response = $this->actingAs($user)
        ->post(route('profile.avatar.store'), ['avatar' => $file]);

    $response->assertRedirect(route('profile.edit'));
    expect($user->fresh()->getFirstMedia('avatar'))->not->toBeNull();
});

test('upload de avatar substitui foto anterior', function () {
    $user = User::factory()->create();

    $file1 = UploadedFile::fake()->image('first.jpg');
    $this->actingAs($user)->post(route('profile.avatar.store'), ['avatar' => $file1]);
    expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);

    $file2 = UploadedFile::fake()->image('second.jpg');
    $this->actingAs($user)->post(route('profile.avatar.store'), ['avatar' => $file2]);
    expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);
});

test('usuário pode remover avatar', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.png');
    $this->actingAs($user)->post(route('profile.avatar.store'), ['avatar' => $file]);

    $response = $this->actingAs($user)
        ->delete(route('profile.avatar.destroy'));

    $response->assertRedirect(route('profile.edit'));
    expect($user->fresh()->getFirstMedia('avatar'))->toBeNull();
});

test('tipo de arquivo inválido é rejeitado', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $response = $this->actingAs($user)
        ->post(route('profile.avatar.store'), ['avatar' => $file]);

    $response->assertSessionHasErrors('avatar');
    expect($user->fresh()->getFirstMedia('avatar'))->toBeNull();
});

test('arquivo maior que 2MB é rejeitado', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('big.jpg')->size(3000);

    $response = $this->actingAs($user)
        ->post(route('profile.avatar.store'), ['avatar' => $file]);

    $response->assertSessionHasErrors('avatar');
});

test('usuário não autenticado não pode fazer upload', function () {
    $file = UploadedFile::fake()->image('avatar.jpg');

    $this->post(route('profile.avatar.store'), ['avatar' => $file])
        ->assertRedirect(route('login'));
});

test('usuário não autenticado não pode remover avatar', function () {
    $this->delete(route('profile.avatar.destroy'))
        ->assertRedirect(route('login'));
});
