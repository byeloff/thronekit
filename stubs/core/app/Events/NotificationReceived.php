<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\NotificationRecipient;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly NotificationRecipient $recipient,
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('App.Models.User.'.$this->recipient->user_id);
    }

    public function broadcastAs(): string
    {
        return 'NotificationReceived';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        $notification = $this->recipient->notification;

        return [
            'id' => $this->recipient->id,
            'notification_id' => $notification->id,
            'title' => $notification->title,
            'body' => $notification->body,
            'type' => $notification->type->value,
            'data' => $notification->data,
            'read_at' => null,
            'action' => null,
            'created_at' => $this->recipient->created_at?->toIso8601String(),
        ];
    }
}
