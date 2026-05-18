<?php

declare(strict_types=1);

namespace App\Services\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Gera e armazena fingerprints server-side combinando headers HTTP com o
 * visitorId do cliente (X-Fingerprint). Usa Redis (cache default) com TTL 24h.
 */
final class FingerprintService
{
    private const HISTORY_TTL = 86400;

    private const MAX_HISTORY_ENTRIES = 100;

    /**
     * Fingerprint server-side baseado em IP + User-Agent + Accept-Language + Accept-Encoding.
     */
    public function serverFingerprint(Request $request): string
    {
        $components = [
            $request->ip() ?? '',
            $request->userAgent() ?? '',
            $request->header('Accept-Language', ''),
            $request->header('Accept-Encoding', ''),
        ];

        return hash('sha256', implode('|', $components));
    }

    /**
     * Chave única de sessão combinando fingerprint server-side com o visitorId do cliente.
     */
    public function sessionKey(Request $request, ?string $clientFingerprint = null): string
    {
        $serverFp = $this->serverFingerprint($request);
        $combined = $serverFp.'|'.($clientFingerprint ?? '');

        return hash('sha256', $combined);
    }

    /**
     * Persiste entrada no histórico do fingerprint (últimos 100 acessos, TTL 24h).
     */
    public function recordHistory(string $key, Request $request): void
    {
        $historyKey = "fp_history:{$key}";

        /** @var list<array{ip: string, at: string}> $history */
        $history = Cache::get($historyKey, []);

        $history[] = [
            'ip' => $request->ip() ?? '',
            'at' => now()->toISOString(),
        ];

        if (count($history) > self::MAX_HISTORY_ENTRIES) {
            $history = array_slice($history, -self::MAX_HISTORY_ENTRIES);
        }

        Cache::put($historyKey, $history, self::HISTORY_TTL);
    }

    public function isIpFlagged(string $ip): bool
    {
        return Cache::has("flagged_ip:{$ip}");
    }

    public function flagIp(string $ip, int $ttl = self::HISTORY_TTL): void
    {
        Cache::put("flagged_ip:{$ip}", true, $ttl);
    }

    public function unflagIp(string $ip): void
    {
        Cache::forget("flagged_ip:{$ip}");
    }
}
