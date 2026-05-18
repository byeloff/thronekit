<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $slug
 * @property string $version
 * @property string $locale
 * @property string $content
 * @property ?CarbonImmutable $published_at
 */
final class TermsAndCondition extends Model
{
    protected $table = 'terms_and_conditions';

    protected $fillable = ['slug', 'version', 'locale', 'content', 'published_at'];

    protected function casts(): array
    {
        return [
            'published_at' => 'immutable_datetime',
        ];
    }

    public function acceptances(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_terms_acceptances')
            ->withPivot(['ip', 'user_agent', 'accepted_at'])
            ->withTimestamps();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function scopeForSlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', $slug);
    }

    public function scopeLatestForLocale(Builder $query, string $locale): Builder
    {
        $fallback = config('app.fallback_locale', 'en');

        return $query->whereIn('locale', [$locale, $fallback])
            ->orderByRaw('CASE WHEN locale = ? THEN 0 ELSE 1 END', [$locale])
            ->orderByDesc('published_at');
    }
}
