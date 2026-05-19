<?php

declare(strict_types=1);

namespace App\Providers;

use App\Enums\FeatureFlag;
use App\Listeners\AuthActivitySubscriber;
use App\Models\User;
use App\Services\Support\FingerprintService;
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
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(FingerprintService::class);
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiters();
        $this->registerEventSubscribers();
        $this->configureInertiaErrors();
        $this->defineFeatureFlags();
    }

    protected function configureRateLimiters(): void
    {
        RateLimiter::for('fingerprinted', function (Request $request): Limit {
            $key = (string) ($request->attributes->get('fingerprint_key') ?? $request->ip());
            $limit = app()->isProduction() ? 60 : 300;

            return Limit::perMinute($limit)->by($key.'|'.$request->ip());
        });

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

    protected function defineFeatureFlags(): void
    {
        Feature::define(FeatureFlag::NewDashboard->value, fn (User $user) => $user->hasRole('superadmin'));
    }

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

        DB::prohibitDestructiveCommands(app()->isProduction());

        /** @var array{min_length: int, require_mixed_case: bool, require_numbers: bool, require_symbols: bool, uncompromised: bool} $policy */
        $policy = config('password');

        $rule = Password::min($policy['min_length']);

        if ($policy['require_mixed_case']) {
            $rule->mixedCase();
        }

        if ($policy['require_numbers']) {
            $rule->numbers();
        }

        if ($policy['require_symbols']) {
            $rule->symbols();
        }

        if ($policy['uncompromised']) {
            $rule->uncompromised();
        }

        Password::defaults($rule);
    }
}
