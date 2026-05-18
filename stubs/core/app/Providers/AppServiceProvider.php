<?php

declare(strict_types=1);

namespace App\Providers;

use App\Listeners\AuthActivitySubscriber;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // [thronekit:fingerprint-singleton]
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiters();
        $this->registerEventSubscribers();
        $this->configureInertiaErrors();
        // [thronekit:pennant-boot-call]
    }

    /**
     * Subscribers de eventos da aplicação. Centralizado aqui para evitar
     * espalhar Event::listen() pelo codebase.
     */
    protected function configureRateLimiters(): void
    {
        // [thronekit:fingerprint-limiter]

        // Exportação de dados pessoais: pesada (ZIP + email) → 3 por hora por usuário.
        RateLimiter::for('privacy-export', fn (Request $request) => Limit::perHour(3)
            ->by($request->user()?->id ?: $request->ip())
        );

        // Anonimização irreversível → 5 tentativas por hora por IP.
        RateLimiter::for('privacy-destroy', fn (Request $request) => Limit::perHour(5)
            ->by($request->user()?->id ?: $request->ip())
        );
    }

    protected function registerEventSubscribers(): void
    {
        Event::subscribe(AuthActivitySubscriber::class);
    }

    protected function configureInertiaErrors(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response): mixed {
            if (in_array($response->statusCode(), [403, 404, 419, 429, 500, 503])) {
                return $response
                    ->render('errors/error-page', ['status' => $response->statusCode()])
                    ->withSharedData();
            }

            return null;
        });
    }

    // [thronekit:pennant-methods]

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        Model::preventLazyLoading(! app()->isProduction());
        Model::preventSilentlyDiscardingAttributes(! app()->isProduction());

        // Sessão não-criptografada em produção viola LGPD/GDPR (dados de sessão
        // em texto puro no Redis/DB). Falhamos rápido para forçar correção no deploy.
        if (app()->isProduction() && ! config('session.encrypt')) {
            throw new \RuntimeException('SESSION_ENCRYPT must be true in production (LGPD/GDPR requirement).');
        }

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
