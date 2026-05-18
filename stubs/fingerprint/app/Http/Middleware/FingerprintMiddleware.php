<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\Support\FingerprintService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Calcula um trust score para cada requisição a partir de fingerprint client+server
 * e bloqueia com 403 requisições abaixo do limiar mínimo.
 *
 * Penalizações do score (base 100):
 *  - Sem X-Fingerprint header: -40
 *  - Sem User-Agent: -50
 *  - IP flagrado no Redis: -30
 *  - X-Fingerprint com menos de 10 chars: -20
 *  - User-Agent com padrão de bot conhecido: -40
 *
 * Injeta `trust_score` e `fingerprint_key` nos atributos da request para uso
 * subsequente (rate limiting, logging, etc.).
 */
final class FingerprintMiddleware
{
    private const SCORE_BASE = 100;

    private const SCORE_MIN = 30;

    private const PENALTY_NO_CLIENT_FP = 40;

    private const PENALTY_SHORT_CLIENT_FP = 20;

    private const PENALTY_NO_UA = 50;

    private const PENALTY_BOT_UA = 40;

    private const PENALTY_FLAGGED_IP = 30;

    /** @var list<string> */
    private const BOT_PATTERNS = [
        'curl',
        'python-requests',
        'scrapy',
        'wget',
        'go-http-client',
        'java/',
        'libwww',
        'lwp-',
        'okhttp',
        'apache-httpclient',
    ];

    public function __construct(
        private readonly FingerprintService $fingerprint,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $clientFp = $request->header('X-Fingerprint');
        $userAgent = $request->userAgent() ?? '';
        $ip = $request->ip() ?? '';

        $score = self::SCORE_BASE;

        if (empty($clientFp)) {
            $score -= self::PENALTY_NO_CLIENT_FP;
        } elseif (strlen($clientFp) < 10) {
            $score -= self::PENALTY_SHORT_CLIENT_FP;
        }

        if (empty($userAgent)) {
            $score -= self::PENALTY_NO_UA;
        } elseif ($this->isBot($userAgent)) {
            $score -= self::PENALTY_BOT_UA;
        }

        if ($ip !== '' && $this->fingerprint->isIpFlagged($ip)) {
            $score -= self::PENALTY_FLAGGED_IP;
        }

        if ($score < self::SCORE_MIN) {
            return response()->json(['error' => 'Suspicious request'], Response::HTTP_FORBIDDEN);
        }

        $fingerprintKey = $this->fingerprint->sessionKey($request, $clientFp ?: null);
        $this->fingerprint->recordHistory($fingerprintKey, $request);

        $request->attributes->set('trust_score', $score);
        $request->attributes->set('fingerprint_key', $fingerprintKey);

        return $next($request);
    }

    private function isBot(string $userAgent): bool
    {
        $lower = strtolower($userAgent);

        foreach (self::BOT_PATTERNS as $pattern) {
            if (str_contains($lower, $pattern)) {
                return true;
            }
        }

        return false;
    }
}
