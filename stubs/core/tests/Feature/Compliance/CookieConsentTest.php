<?php

declare(strict_types=1);

namespace Tests\Feature\Compliance;

use App\Http\Middleware\HandleInertiaRequests;
use App\Services\Support\CookieConsentState;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CookieConsentTest extends TestCase
{
    public function test_store_sets_cookie_consent_without_http_only_flag(): void
    {
        $response = $this->put(route('cookie-consent.store'), [
            'analytics' => true,
            'marketing' => false,
        ]);

        $response->assertRedirect();

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => $cookie->getName() === 'cookie_consent');

        $this->assertNotNull($cookie);
        $this->assertFalse($cookie->isHttpOnly());

        $decoded = json_decode($cookie->getValue(), true, 512, JSON_THROW_ON_ERROR);
        $this->assertTrue($decoded['essential']);
        $this->assertTrue($decoded['analytics']);
        $this->assertFalse($decoded['marketing']);
    }

    public function test_inertia_middleware_shares_cookie_consent_when_cookie_is_present(): void
    {
        $payload = CookieConsentState::payload(analytics: true, marketing: false);

        $request = Request::create('/', 'GET');
        $request->cookies->set('cookie_consent', json_encode($payload, JSON_THROW_ON_ERROR));

        $shared = app(HandleInertiaRequests::class)->share($request);

        $this->assertSame([
            'essential' => true,
            'analytics' => true,
            'marketing' => false,
        ], $shared['cookieConsent']);
    }

    public function test_inertia_shares_null_cookie_consent_without_cookie(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('cookieConsent', null),
            );
    }
}
