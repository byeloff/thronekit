<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Anonymizable;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\Models\Concerns\CausesActivity;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Traits\HasRoles;
use Spatie\PersonalDataExport\ExportsPersonalData;
use Spatie\PersonalDataExport\PersonalDataSelection;

#[Fillable(['name', 'email', 'password', 'locale'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements ExportsPersonalData, HasMedia
{
    /** @use HasFactory<UserFactory> */
    use Anonymizable {
        anonymize as anonymizeBase;
    }

    use CausesActivity;
    use HasFactory;
    use HasRoles;
    use InteractsWithMedia;
    use LogsActivity;
    use Notifiable;
    use Searchable;
    use TwoFactorAuthenticatable;

    /** @var list<string> */
    protected $appends = ['avatar'];

    /** @var list<string> */
    protected array $anonymizable = ['name', 'email'];

    /* ------------------------------- Media ---------------------------------- */

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->performOnCollections('avatar')
            ->nonQueued();
    }

    protected function avatar(): Attribute
    {
        return Attribute::get(
            fn () => $this->getFirstMediaUrl('avatar', 'thumb') ?: null,
        );
    }

    public function anonymize(): static
    {
        $this->clearMediaCollection();

        return $this->anonymizeBase();
    }

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

    /* ----------------------------- Activity log ----------------------------- */

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'locale'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('user');
    }

    /* -------------------------- Personal data export ------------------------ */

    public function selectPersonalData(PersonalDataSelection $personalDataSelection): void
    {
        $avatar = $this->getFirstMedia('avatar');
        if ($avatar !== null) {
            $personalDataSelection->addFile($avatar->getPath(), 'avatar.'.$avatar->extension);
        }

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
            ->add('activity_log.json', $this->activitiesAsCauser()
                ->latest()
                ->limit(500)
                ->get(['log_name', 'description', 'event', 'properties', 'created_at'])
                ->toArray()
            )
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
