<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (app()->environment('local')) {
            // Em local, default-src * já cobre tudo; não sobrescrever com style-src
            // mais restritivo (quebraria o hot-reload do Vite em IPv6).
            $cspPolicy = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;";
        } else {
            // Laravel Horizon (Vue) usa new Function() no bundle; sem 'unsafe-eval' o dashboard quebra.
            $horizonPrefix = trim((string) config('horizon.path', 'horizon'), '/');
            $isHorizonRequest = $request->path() === $horizonPrefix
                || str_starts_with($request->path(), $horizonPrefix.'/');

            $scriptSrc = "script-src 'self' 'unsafe-inline' ";
            if ($isHorizonRequest) {
                $scriptSrc .= "'unsafe-eval' ";
            }
            $scriptSrc .= 'https://cdn.jsdelivr.net https://*.googleapis.com https://d3e54v103j8qbb.cloudfront.net https://cdnjs.cloudflare.com https://static.cloudflareinsights.com; ';

            $cspPolicy = "default-src 'self'; ".
                $scriptSrc.
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://fonts.googleapis.com https://fonts.bunny.net; ".
                "img-src 'self' data: https: blob:; ".
                "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com https://*.gstatic.com https://fonts.bunny.net https://cdn.jsdelivr.net; ".
                "connect-src 'self' https://*.amazonaws.com https://*.digitaloceanspaces.com https://cloudflareinsights.com; ".
                "frame-src 'self' https://www.youtube.com; ".
                "object-src 'self'; ".
                "base-uri 'self'; ".
                "form-action 'self'; ".
                "frame-ancestors 'self'; ".
                "media-src 'self' blob:; ".
                "worker-src 'self' blob:;";
        }

        $response->headers->set('Content-Security-Policy', $cspPolicy);
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');

        $allowedOrigins = [
            'https://backstage.vibbehub.com',
            'https://vibbehub.com',
        ];

        $origin = $request->header('Origin');
        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        return $response;
    }
}
