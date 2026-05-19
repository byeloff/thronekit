<?php

declare(strict_types=1);

use App\Http\Middleware\FingerprintMiddleware;
use App\Services\Support\FingerprintService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

it('requisição normal de browser passa com score 100', function (): void {
    $service = app(FingerprintService::class);

    $request = Request::create('/test', 'POST');
    $request->headers->set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    $request->headers->set('X-Fingerprint', 'fp_abc123def456ghi789');
    $request->headers->set('Accept-Language', 'pt-BR,pt;q=0.9');
    $request->server->set('REMOTE_ADDR', '192.168.1.1');

    $middleware = new FingerprintMiddleware($service);

    $called = false;
    $next = function ($req) use (&$called) {
        $called = true;

        return response()->json(['ok' => true]);
    };

    $response = $middleware->handle($request, $next);

    expect($called)->toBeTrue()
        ->and($request->attributes->get('trust_score'))->toBe(100)
        ->and($request->attributes->get('fingerprint_key'))->toBeString()->not->toBeEmpty()
        ->and($response->getStatusCode())->toBe(200);
});

it('penaliza score em 40 quando X-Fingerprint está ausente mas request continua', function (): void {
    $service = app(FingerprintService::class);

    $request = Request::create('/test', 'POST');
    $request->headers->set('User-Agent', 'Mozilla/5.0 (compatible; Legitimate Browser)');
    $request->server->set('REMOTE_ADDR', '127.0.0.1');

    $middleware = new FingerprintMiddleware($service);

    $called = false;
    $next = function ($req) use (&$called) {
        $called = true;

        return response()->json(['ok' => true]);
    };

    $middleware->handle($request, $next);

    // 100 - 40 (sem X-Fingerprint) = 60 → passa
    expect($called)->toBeTrue()
        ->and($request->attributes->get('trust_score'))->toBe(60);
});

it('penaliza score em 30 quando IP está flagrado no Redis', function (): void {
    $service = app(FingerprintService::class);

    $ip = '10.0.0.99';
    $service->flagIp($ip, ttl: 60);

    $request = Request::create('/test', 'POST');
    $request->headers->set('User-Agent', 'Mozilla/5.0 (compatible; Legitimate Browser)');
    $request->headers->set('X-Fingerprint', 'valid-fingerprint-12345');
    $request->server->set('REMOTE_ADDR', $ip);

    $middleware = new FingerprintMiddleware($service);

    $called = false;
    $next = function ($req) use (&$called) {
        $called = true;

        return response()->json(['ok' => true]);
    };

    $middleware->handle($request, $next);

    // 100 - 30 (IP flagrado) = 70 → passa
    expect($called)->toBeTrue()
        ->and($request->attributes->get('trust_score'))->toBe(70);

    $service->unflagIp($ip);
});

it('retorna 403 quando IP flagrado + sem X-Fingerprint + sem User-Agent', function (): void {
    $service = app(FingerprintService::class);

    $ip = '10.0.0.88';
    $service->flagIp($ip, ttl: 60);

    $request = Request::create('/test', 'POST');
    $request->server->set('REMOTE_ADDR', $ip);
    // Request::create() injeta "Symfony" como UA por padrão — remover explicitamente.
    $request->headers->remove('User-Agent');
    $request->server->remove('HTTP_USER_AGENT');

    $middleware = new FingerprintMiddleware($service);
    $next = fn ($req) => response()->json(['ok' => true]);

    // Score: 100 - 40 (sem fp) - 50 (sem UA) - 30 (IP flagrado) = -20 < 30 → 403
    $response = $middleware->handle($request, $next);

    expect($response->getStatusCode())->toBe(403)
        ->and(json_decode((string) $response->getContent(), true))->toBe(['error' => 'Suspicious request']);

    $service->unflagIp($ip);
});

it('retorna 403 para User-Agent de bot conhecido sem X-Fingerprint', function (): void {
    $service = app(FingerprintService::class);

    $botUserAgents = ['curl/7.88.1', 'python-requests/2.31.0', 'Scrapy/2.11.0'];

    foreach ($botUserAgents as $botUA) {
        $request = Request::create('/test', 'POST');
        $request->headers->set('User-Agent', $botUA);
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $middleware = new FingerprintMiddleware($service);
        $next = fn ($req) => response()->json(['ok' => true]);

        // Score: 100 - 40 (sem fp) - 40 (bot UA) = 20 < 30 → 403
        $response = $middleware->handle($request, $next);

        expect($response->getStatusCode())->toBe(403, "Esperava 403 para UA: {$botUA}");
    }
});

it('penaliza score em 20 quando X-Fingerprint tem menos de 10 chars', function (): void {
    $service = app(FingerprintService::class);

    $request = Request::create('/test', 'POST');
    $request->headers->set('User-Agent', 'Mozilla/5.0 (compatible)');
    $request->headers->set('X-Fingerprint', 'abc');
    $request->server->set('REMOTE_ADDR', '127.0.0.1');

    $middleware = new FingerprintMiddleware($service);

    $called = false;
    $next = function ($req) use (&$called) {
        $called = true;

        return response()->json(['ok' => true]);
    };

    $middleware->handle($request, $next);

    // 100 - 20 (fp curto) = 80 → passa
    expect($called)->toBeTrue()
        ->and($request->attributes->get('trust_score'))->toBe(80);
});

it('fingerprint:flag-ip adiciona IP ao Redis e fingerprint:unflag-ip remove', function (): void {
    $ip = '203.0.113.42';
    $service = app(FingerprintService::class);

    expect($service->isIpFlagged($ip))->toBeFalse();

    $this->artisan('fingerprint:flag-ip', ['ip' => $ip, '--ttl' => 60])
        ->assertSuccessful();

    expect($service->isIpFlagged($ip))->toBeTrue();

    $this->artisan('fingerprint:unflag-ip', ['ip' => $ip])
        ->assertSuccessful();

    expect($service->isIpFlagged($ip))->toBeFalse();
});

it('fingerprint:flag-ip rejeita IP inválido', function (): void {
    $this->artisan('fingerprint:flag-ip', ['ip' => 'not-an-ip'])
        ->assertFailed();
});

it('rate limiting bloqueia após exceder o limite configurado', function (): void {
    $limiterKey = 'fingerprinted-unit-test|127.0.0.1';

    RateLimiter::clear($limiterKey);

    // Registra limiter de 2 req/min para o teste
    RateLimiter::for('fingerprinted-unit', fn () => Limit::perMinute(2)->by('unit-test'));

    // Simula 2 hits (dentro do limite)
    RateLimiter::hit($limiterKey, 60);
    RateLimiter::hit($limiterKey, 60);

    // Na 3ª tentativa deve estar bloqueado
    expect(RateLimiter::tooManyAttempts($limiterKey, 2))->toBeTrue();

    RateLimiter::clear($limiterKey);
});

it('FingerprintService gera session keys diferentes com e sem client fingerprint', function (): void {
    $service = app(FingerprintService::class);
    $request = Request::create('/test', 'GET');
    $request->headers->set('User-Agent', 'Mozilla/5.0');
    $request->server->set('REMOTE_ADDR', '127.0.0.1');

    $keyWithFp = $service->sessionKey($request, 'client-fp-abc123');
    $keyWithoutFp = $service->sessionKey($request, null);

    expect($keyWithFp)->not->toBe($keyWithoutFp)
        ->and($keyWithFp)->toHaveLength(64)
        ->and($keyWithoutFp)->toHaveLength(64);
});

it('FingerprintService registra histórico no cache com estrutura correta', function (): void {
    $service = app(FingerprintService::class);
    $request = Request::create('/test', 'POST');
    $request->server->set('REMOTE_ADDR', '127.0.0.1');

    $key = 'test-fp-history-'.uniqid();
    Cache::forget("fp_history:{$key}");

    $service->recordHistory($key, $request);
    $service->recordHistory($key, $request);

    $history = Cache::get("fp_history:{$key}");

    expect($history)->toBeArray()->toHaveCount(2)
        ->and($history[0])->toHaveKey('ip')
        ->and($history[0])->toHaveKey('at')
        ->and($history[0]['ip'])->toBe('127.0.0.1');

    Cache::forget("fp_history:{$key}");
});
