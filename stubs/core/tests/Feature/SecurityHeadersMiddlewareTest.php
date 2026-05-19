<?php

declare(strict_types=1);

it('adiciona headers de segurança em todas as respostas web', function () {
    $response = $this->get('/');

    $response->assertHeader('X-Content-Type-Options', 'nosniff');
    $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
    $response->assertHeader('X-XSS-Protection', '1; mode=block');
    $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->assertHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
    $response->assertHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    $response->assertHeader('Content-Security-Policy');
    $response->assertHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    $response->assertHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    $response->assertHeader('Access-Control-Allow-Credentials', 'true');
    $response->assertHeader('Access-Control-Max-Age', '86400');
});

it('inclui unsafe-inline na CSP de produção para scripts e estilos', function () {
    $response = $this->get('/');

    expect($response->headers->get('Content-Security-Policy'))
        ->toContain("'unsafe-inline'");
});

it('define Access-Control-Allow-Origin apenas para origens permitidas', function () {
    $response = $this->withHeaders(['Origin' => 'https://backstage.vibbehub.com'])->get('/');
    $response->assertHeader('Access-Control-Allow-Origin', 'https://backstage.vibbehub.com');

    $response = $this->withHeaders(['Origin' => 'https://vibbehub.com'])->get('/');
    $response->assertHeader('Access-Control-Allow-Origin', 'https://vibbehub.com');
});

it('não define Access-Control-Allow-Origin para origens não permitidas', function () {
    $response = $this->withHeaders(['Origin' => 'https://evil.com'])->get('/');

    expect($response->headers->has('Access-Control-Allow-Origin'))->toBeFalse();
});
