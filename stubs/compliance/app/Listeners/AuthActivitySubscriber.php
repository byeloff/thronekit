<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Arr;
use Laravel\Fortify\Events\PasswordUpdatedViaController;
use Laravel\Fortify\Events\RecoveryCodeReplaced;
use Laravel\Fortify\Events\RecoveryCodesGenerated;
use Laravel\Fortify\Events\TwoFactorAuthenticationConfirmed;
use Laravel\Fortify\Events\TwoFactorAuthenticationDisabled;
use Laravel\Fortify\Events\TwoFactorAuthenticationEnabled;
use Laravel\Fortify\Events\TwoFactorAuthenticationFailed;

/**
 * Registra eventos sensíveis de autenticação no activity_log para auditoria
 * LGPD/GDPR. NÃO loga senhas, recovery codes ou tokens — apenas metadados
 * (email tentado, ip, user agent, timestamps).
 */
final class AuthActivitySubscriber
{
    public function handleLogin(Login $event): void
    {
        $user = $event->user;
        if (! $user instanceof User) {
            return;
        }

        activity('user')
            ->causedBy($user)
            ->event('login')
            ->withProperties($this->requestProperties() + ['guard' => $event->guard])
            ->log('User logged in.');
    }

    public function handleLogout(Logout $event): void
    {
        $user = $event->user;
        if (! $user instanceof User) {
            return;
        }

        activity('user')
            ->causedBy($user)
            ->event('logout')
            ->withProperties(['guard' => $event->guard])
            ->log('User logged out.');
    }

    public function handleFailed(Failed $event): void
    {
        $properties = $this->requestProperties() + [
            'guard' => $event->guard,
            'email' => $this->extractEmail($event->credentials),
        ];

        activity('user')
            ->causedBy($event->user instanceof User ? $event->user : null)
            ->event('login_failed')
            ->withProperties($properties)
            ->log('Login attempt failed.');
    }

    public function handleLockout(Lockout $event): void
    {
        activity('user')
            ->event('login_lockout')
            ->withProperties($this->requestProperties() + [
                'email' => $this->extractEmail((array) $event->request->only(['email'])),
            ])
            ->log('Login lockout triggered (rate limit).');
    }

    public function handlePasswordReset(PasswordReset $event): void
    {
        if (! $event->user instanceof User) {
            return;
        }

        activity('user')
            ->causedBy($event->user)
            ->event('password_reset')
            ->withProperties($this->requestProperties())
            ->log('User reset their password.');
    }

    public function handlePasswordUpdated(PasswordUpdatedViaController $event): void
    {
        if (! $event->user instanceof User) {
            return;
        }

        activity('user')
            ->causedBy($event->user)
            ->event('password_updated')
            ->withProperties($this->requestProperties())
            ->log('User updated their password.');
    }

    public function handleTwoFactorEnabled(TwoFactorAuthenticationEnabled $event): void
    {
        $this->logTwoFactorEvent($event->user, '2fa_enabled', 'User enabled two-factor authentication.');
    }

    public function handleTwoFactorDisabled(TwoFactorAuthenticationDisabled $event): void
    {
        $this->logTwoFactorEvent($event->user, '2fa_disabled', 'User disabled two-factor authentication.');
    }

    public function handleTwoFactorConfirmed(TwoFactorAuthenticationConfirmed $event): void
    {
        $this->logTwoFactorEvent($event->user, '2fa_confirmed', 'User confirmed two-factor authentication setup.');
    }

    public function handleTwoFactorFailed(TwoFactorAuthenticationFailed $event): void
    {
        $this->logTwoFactorEvent(
            $event->user,
            '2fa_failed',
            'Two-factor authentication challenge failed.',
        );
    }

    public function handleRecoveryCodesGenerated(RecoveryCodesGenerated $event): void
    {
        $this->logTwoFactorEvent(
            $event->user,
            '2fa_recovery_codes_regenerated',
            'User regenerated 2FA recovery codes.',
        );
    }

    public function handleRecoveryCodeReplaced(RecoveryCodeReplaced $event): void
    {
        $this->logTwoFactorEvent(
            $event->user,
            '2fa_recovery_code_used',
            'User authenticated with a recovery code (code consumed).',
        );
    }

    /**
     * @return array<class-string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleLogin',
            Logout::class => 'handleLogout',
            Failed::class => 'handleFailed',
            Lockout::class => 'handleLockout',
            PasswordReset::class => 'handlePasswordReset',
            PasswordUpdatedViaController::class => 'handlePasswordUpdated',
            TwoFactorAuthenticationEnabled::class => 'handleTwoFactorEnabled',
            TwoFactorAuthenticationDisabled::class => 'handleTwoFactorDisabled',
            TwoFactorAuthenticationConfirmed::class => 'handleTwoFactorConfirmed',
            TwoFactorAuthenticationFailed::class => 'handleTwoFactorFailed',
            RecoveryCodesGenerated::class => 'handleRecoveryCodesGenerated',
            RecoveryCodeReplaced::class => 'handleRecoveryCodeReplaced',
        ];
    }

    private function logTwoFactorEvent(mixed $user, string $event, string $description): void
    {
        if (! $user instanceof User) {
            return;
        }

        activity('user')
            ->causedBy($user)
            ->event($event)
            ->withProperties($this->requestProperties())
            ->log($description);
    }

    /**
     * @return array<string, mixed>
     */
    private function requestProperties(): array
    {
        $request = request();
        if ($request === null) {
            return [];
        }

        return [
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ];
    }

    /**
     * @param  array<string, mixed>  $credentials
     */
    private function extractEmail(array $credentials): ?string
    {
        $value = Arr::get($credentials, 'email');

        return is_string($value) ? $value : null;
    }
}
