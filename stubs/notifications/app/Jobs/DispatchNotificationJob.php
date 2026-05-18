<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\NotificationTarget;
use App\Events\NotificationReceived;
use App\Models\Notification;
use App\Models\NotificationRecipient;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class DispatchNotificationJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly Notification $notification,
    ) {}

    public function handle(): void
    {
        $notification = $this->notification;

        $this->resolveTargetUsers($notification)->chunk(100, function ($users) use ($notification): void {
            DB::transaction(function () use ($users, $notification): void {
                foreach ($users as $user) {
                    $existing = NotificationRecipient::where('notification_id', $notification->id)
                        ->where('user_id', $user->id)
                        ->exists();

                    if ($existing) {
                        continue;
                    }

                    $recipient = NotificationRecipient::create([
                        'notification_id' => $notification->id,
                        'user_id' => $user->id,
                        'created_at' => now(),
                    ]);

                    $recipient->setRelation('notification', $notification);

                    broadcast(new NotificationReceived($recipient));
                }
            });
        });

        $notification->update(['dispatched_at' => now()]);
    }

    private function resolveTargetUsers(Notification $notification): Builder
    {
        $query = User::query()->whereNull('anonymized_at');

        return match ($notification->target_type) {
            NotificationTarget::All => $query,
            NotificationTarget::Role => $query->role($notification->target_roles ?? []),
            NotificationTarget::Specific => $query->whereIn('id', $notification->target_user_ids ?? []),
        };
    }
}
