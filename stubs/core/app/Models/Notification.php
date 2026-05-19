<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\NotificationTarget;
use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'body', 'type', 'data', 'target_type', 'target_roles', 'target_user_ids', 'sender_id', 'dispatched_at'])]
class Notification extends Model
{
    protected function casts(): array
    {
        return [
            'type' => NotificationType::class,
            'target_type' => NotificationTarget::class,
            'target_roles' => 'array',
            'target_user_ids' => 'array',
            'data' => 'array',
            'dispatched_at' => 'datetime',
        ];
    }

    public function isDraft(): bool
    {
        return $this->dispatched_at === null;
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(NotificationRecipient::class);
    }
}
