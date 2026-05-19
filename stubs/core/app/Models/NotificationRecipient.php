<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['notification_id', 'user_id', 'read_at', 'action', 'acted_at', 'created_at'])]
class NotificationRecipient extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'acted_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
