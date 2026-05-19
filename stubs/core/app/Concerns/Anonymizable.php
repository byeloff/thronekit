<?php

declare(strict_types=1);

namespace App\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Anonymize PII fields in-place (direito ao esquecimento LGPD/GDPR).
 *
 * O model que usa o trait declara duas coisas:
 *  - `array $anonymizable` — colunas a substituir por placeholder.
 *  - método opcional `anonymizableEmail(int $id): string` — gera o email canônico
 *    (default: `anonymous-{id}@anonymized.local`).
 *
 * Após `anonymize()` o registro fica com `anonymized_at` setado, PII redactada e
 * (se aplicável) `email_verified_at` zerado para impedir login posterior.
 */
trait Anonymizable
{
    public function anonymize(): static
    {
        $this->ensureColumnExists();

        DB::transaction(function (): void {
            /** @var array<int, string> $fields */
            $fields = property_exists($this, 'anonymizable') ? $this->anonymizable : [];

            foreach ($fields as $field) {
                $this->{$field} = $this->anonymizedValueFor($field);
            }

            $this->anonymized_at = now();

            // Invalida login se houver email/password.
            if ($this->isFillable('password') || array_key_exists('password', $this->attributes)) {
                $this->password = Str::random(64);
            }
            if (array_key_exists('email_verified_at', $this->attributes)) {
                $this->email_verified_at = null;
            }

            // Desativa 2FA caso o model tenha as colunas do Fortify.
            foreach (['two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at'] as $col) {
                if (array_key_exists($col, $this->attributes)) {
                    $this->{$col} = null;
                }
            }

            $this->save();
        });

        return $this;
    }

    public function isAnonymized(): bool
    {
        return $this->anonymized_at !== null;
    }

    /**
     * Substitui o valor de um campo por um placeholder previsível.
     * Override no model se precisar de regra específica para algum campo.
     */
    protected function anonymizedValueFor(string $field): mixed
    {
        if ($field === 'email') {
            return method_exists($this, 'anonymizableEmail')
                ? $this->anonymizableEmail($this->getKey() ?? 0)
                : sprintf('anonymous-%d@anonymized.local', $this->getKey() ?? 0);
        }

        return '[anonymized]';
    }

    private function ensureColumnExists(): void
    {
        /** @phpstan-ignore-next-line */
        if (! Schema::hasColumn($this->getTable(), 'anonymized_at')) {
            throw new \LogicException(sprintf(
                'Model %s usa o trait Anonymizable mas a tabela %s não tem a coluna `anonymized_at`. '
                .'Adicione via migration antes de chamar anonymize().',
                static::class,
                $this->getTable(),
            ));
        }
    }

    public function initializeAnonymizable(): void
    {
        $this->casts['anonymized_at'] = 'datetime';
    }
}
