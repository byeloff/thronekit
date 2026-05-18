<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Notification */
class NotificationResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'type' => $this->type->value,
            'data' => $this->data,
            'target_type' => $this->target_type->value,
            'target_roles' => $this->target_roles,
            'target_user_ids' => $this->target_user_ids,
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender?->id,
                'name' => $this->sender?->name,
            ]),
            'recipients_count' => $this->whenCounted('recipients'),
            'dispatched_at' => $this->dispatched_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
