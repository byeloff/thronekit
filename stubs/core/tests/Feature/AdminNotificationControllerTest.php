<?php

declare(strict_types=1);

use App\Enums\NotificationTarget;
use App\Enums\NotificationType;
use App\Enums\Role;
use App\Jobs\DispatchNotificationJob;
use App\Models\Notification;
use App\Models\NotificationRecipient;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

beforeEach(fn () => (new RoleSeeder)->run());

function makeAdmin(): User
{
    $user = User::factory()->create();
    $user->assignRole(Role::Admin);

    return $user;
}

function makeSuperAdmin(): User
{
    $user = User::factory()->create();
    $user->assignRole(Role::SuperAdmin);

    return $user;
}

function makeNotification(bool $sent = false): Notification
{
    return Notification::create([
        'title' => 'Test',
        'body' => 'Body',
        'type' => NotificationType::Info->value,
        'target_type' => NotificationTarget::All->value,
        'dispatched_at' => $sent ? now() : null,
    ]);
}

/* ─────────────────────────────────────────── index ── */

it('superadmin acessa a listagem de notificações', function () {
    $this->actingAs(makeSuperAdmin())
        ->get(route('admin.notifications.index'))
        ->assertOk()
        ->assertInertia(fn ($p) => $p->component('admin/notifications/index'));
});

it('admin acessa a listagem de notificações', function () {
    $this->actingAs(makeAdmin())
        ->get(route('admin.notifications.index'))
        ->assertOk();
});

it('usuário comum é bloqueado na listagem', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('admin.notifications.index'))
        ->assertForbidden();
});

/* ─────────────────────────────────────────── store ── */

it('admin cria um rascunho de notificação', function () {
    $admin = makeAdmin();

    $this->actingAs($admin)
        ->post(route('admin.notifications.store'), [
            'title' => 'Aviso importante',
            'body' => 'Conteúdo da notificação.',
            'type' => 'info',
            'target_type' => 'all',
        ])
        ->assertRedirect(route('admin.notifications.index'));

    expect(Notification::where('title', 'Aviso importante')->exists())->toBeTrue();
});

/* ─────────────────────────────────────────── update ── */

it('admin edita um rascunho', function () {
    $admin = makeAdmin();
    $notification = makeNotification();

    $this->actingAs($admin)
        ->put(route('admin.notifications.update', $notification), [
            'title' => 'Título atualizado',
            'body' => 'Novo corpo.',
            'type' => 'info',
            'target_type' => 'all',
        ])
        ->assertRedirect(route('admin.notifications.index'));

    expect($notification->fresh()->title)->toBe('Título atualizado');
});

it('admin não pode editar notificação já enviada', function () {
    $admin = makeAdmin();
    $notification = makeNotification(sent: true);

    $this->actingAs($admin)
        ->put(route('admin.notifications.update', $notification), [
            'title' => 'Hacked',
            'body' => 'Body',
            'type' => 'info',
            'target_type' => 'all',
        ])
        ->assertRedirect();

    expect($notification->fresh()->title)->toBe('Test');
});

/* ─────────────────────────────────────────── dispatch ── */

it('admin dispara notificação — job é enfileirado', function () {
    Queue::fake();
    $admin = makeAdmin();
    $notification = makeNotification();

    $this->actingAs($admin)
        ->post(route('admin.notifications.dispatch', $notification))
        ->assertRedirect();

    Queue::assertPushed(DispatchNotificationJob::class);
});

it('admin não pode disparar notificação já enviada', function () {
    Queue::fake();
    $admin = makeAdmin();
    $notification = makeNotification(sent: true);

    $this->actingAs($admin)
        ->post(route('admin.notifications.dispatch', $notification))
        ->assertRedirect();

    Queue::assertNothingPushed();
});

/* ─────────────────────────────────────────── destroy ── */

it('admin exclui rascunho', function () {
    $admin = makeAdmin();
    $notification = makeNotification();

    $this->actingAs($admin)
        ->delete(route('admin.notifications.destroy', $notification))
        ->assertRedirect(route('admin.notifications.index'));

    expect(Notification::find($notification->id))->toBeNull();
});

it('admin não pode excluir notificação enviada', function () {
    $admin = makeAdmin();
    $notification = makeNotification(sent: true);

    $this->actingAs($admin)
        ->delete(route('admin.notifications.destroy', $notification))
        ->assertRedirect();

    expect(Notification::find($notification->id))->not->toBeNull();
});

/* ─────────────────────────────────────────── user endpoints ── */

it('usuário vê suas notificações em JSON', function () {
    $user = User::factory()->create();
    $user->assignRole(Role::B2c);

    $notification = makeNotification(sent: true);
    NotificationRecipient::create([
        'notification_id' => $notification->id,
        'user_id' => $user->id,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->getJson(route('notifications.index'))
        ->assertOk()
        ->assertJsonStructure(['data', 'unread_count']);
});

it('usuário marca notificação como lida', function () {
    $user = User::factory()->create();
    $user->assignRole(Role::B2c);

    $notification = makeNotification(sent: true);
    $recipient = NotificationRecipient::create([
        'notification_id' => $notification->id,
        'user_id' => $user->id,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->postJson(route('notifications.read', $recipient))
        ->assertOk();

    expect($recipient->fresh()->read_at)->not->toBeNull();
});

it('usuário toma ação em notificação', function () {
    $user = User::factory()->create();
    $user->assignRole(Role::B2c);

    $notification = Notification::create([
        'title' => 'Aprovar?',
        'body' => 'Deseja aprovar?',
        'type' => NotificationType::Action->value,
        'target_type' => NotificationTarget::All->value,
        'dispatched_at' => now(),
    ]);
    $recipient = NotificationRecipient::create([
        'notification_id' => $notification->id,
        'user_id' => $user->id,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->postJson(route('notifications.action', $recipient), ['action' => 'yes'])
        ->assertOk();

    expect($recipient->fresh()->action)->toBe('yes');
});

it('usuário não pode ler notificação de outro usuário', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $notification = makeNotification(sent: true);
    $recipient = NotificationRecipient::create([
        'notification_id' => $notification->id,
        'user_id' => $user1->id,
        'created_at' => now(),
    ]);

    $this->actingAs($user2)
        ->postJson(route('notifications.read', $recipient))
        ->assertForbidden();
});
