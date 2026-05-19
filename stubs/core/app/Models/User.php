<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Anonymizable;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Scout\Searchable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\PersonalDataExport\ExportsPersonalData;
use Spatie\PersonalDataExport\PersonalDataSelection;

#[Fillable(['name', 'email', 'password', 'locale'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements ExportsPersonalData
{
    /** @use HasFactory<UserFactory> */
    use Anonymizable;

    use HasFactory;
    use HasRoles;
    use Notifiable;
    use Searchable;
    use TwoFactorAuthenticatable;

    /**
     * Campos substituídos pelo trait Anonymizable na exclusão LGPD/GDPR.
     *
     * @var list<string>
     */
    protected array $anonymizable = ['name', 'email'];

    /* --------------------------------- Scout -------------------------------- */

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
        ];
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'anonymized_at' => 'datetime',
        ];
    }

    /* -------------------------- Personal data export ------------------------ */

    public function selectPersonalData(PersonalDataSelection $personalDataSelection): void
    {
        $personalDataSelection
            ->add('user.json', [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'locale' => $this->locale,
                'email_verified_at' => $this->email_verified_at?->toIso8601String(),
                'two_factor_enabled' => $this->two_factor_confirmed_at !== null,
                'created_at' => $this->created_at?->toIso8601String(),
            ])
            ->add('terms_acceptances.json', $this->acceptedTerms()
                ->get(['terms_and_conditions.slug', 'terms_and_conditions.version', 'terms_and_conditions.locale'])
                ->map(fn ($t) => [
                    'slug' => $t->slug,
                    'version' => $t->version,
                    'locale' => $t->locale,
                    'accepted_at' => $t->pivot->accepted_at,
                    'ip' => $t->pivot->ip,
                    'user_agent' => $t->pivot->user_agent,
                    'fingerprint_key' => $t->pivot->fingerprint_key,
                ])
                ->toArray()
            );
    }

    public function personalDataExportName(): string
    {
        return sprintf('personal-data-%d-%s.zip', $this->id, now()->format('Ymd-His'));
    }

    /* ----------------------------- Terms acceptance ------------------------- */

    public function acceptedTerms(): BelongsToMany
    {
        return $this->belongsToMany(TermsAndCondition::class, 'user_terms_acceptances')
            ->withPivot(['ip', 'user_agent', 'fingerprint_key', 'accepted_at'])
            ->withTimestamps();
    }
}
