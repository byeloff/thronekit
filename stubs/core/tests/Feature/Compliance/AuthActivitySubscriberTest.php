<?php

declare(strict_types=1);

namespace Tests\Feature\Compliance;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class AuthActivitySubscriberTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_login_is_logged_in_activity_log(): void
    {
        $user = User::factory()->create();

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $activity = Activity::where('log_name', 'user')
            ->where('event', 'login')
            ->latest('id')
            ->first();

        $this->assertNotNull($activity, 'Expected a login activity to be logged.');
        $this->assertSame($user->id, (int) $activity->causer_id);
        $this->assertSame(User::class, $activity->causer_type);
        $this->assertSame('User logged in.', $activity->description);
        $this->assertArrayHasKey('ip', $activity->properties->toArray());
        $this->assertArrayHasKey('user_agent', $activity->properties->toArray());
    }

    public function test_failed_login_is_logged_without_password(): void
    {
        $user = User::factory()->create();

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $activity = Activity::where('log_name', 'user')
            ->where('event', 'login_failed')
            ->latest('id')
            ->first();

        $this->assertNotNull($activity, 'Expected a login_failed activity to be logged.');
        $this->assertSame('Login attempt failed.', $activity->description);

        $properties = $activity->properties->toArray();
        $this->assertSame($user->email, $properties['email']);
        $this->assertArrayNotHasKey('password', $properties);
    }

    public function test_logout_is_logged_in_activity_log(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('logout'));

        $activity = Activity::where('log_name', 'user')
            ->where('event', 'logout')
            ->latest('id')
            ->first();

        $this->assertNotNull($activity, 'Expected a logout activity to be logged.');
        $this->assertSame($user->id, (int) $activity->causer_id);
        $this->assertSame('User logged out.', $activity->description);
    }
}
