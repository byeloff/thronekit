<?php

declare(strict_types=1);

namespace App\Services\Support;

use Illuminate\Http\Request;
use JsonException;

/**
 * Lê e serializa o cookie JSON `cookie_consent` (consentimento LGPD/GDPR).
 */
final class CookieConsentState
{
    /**
     * @return array{essential: bool, analytics: bool, marketing: bool}|null
     */
    public static function fromRequest(Request $request): ?array
    {
        return self::fromRaw($request->cookie('cookie_consent'));
    }

    /**
     * @return array{essential: bool, analytics: bool, marketing: bool}|null
     */
    public static function fromRaw(?string $raw): ?array
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        try {
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return null;
        }

        if (! is_array($parsed)) {
            return null;
        }

        return [
            'essential' => true,
            'analytics' => (bool) ($parsed['analytics'] ?? false),
            'marketing' => (bool) ($parsed['marketing'] ?? false),
        ];
    }

    /**
     * @return array{essential: bool, analytics: bool, marketing: bool, recorded_at: string, version: string}
     */
    public static function payload(bool $analytics, bool $marketing): array
    {
        return [
            'essential' => true,
            'analytics' => $analytics,
            'marketing' => $marketing,
            'recorded_at' => now()->toIso8601String(),
            'version' => '1',
        ];
    }
}
