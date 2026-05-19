<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\NotificationRecipient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NotificationRecipient */
class UserNotificationResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'notification_id' => $this->notification_id,
            'title' => $this->notification->title,
            'body' => $this->notification->body,
            'type' => $this->notification->type->value,
            'data' => $this->notification->data,
            'read_at' => $this->read_at?->toIso8601String(),
            'action' => $this->action,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
