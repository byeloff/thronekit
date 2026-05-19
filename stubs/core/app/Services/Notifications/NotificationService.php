<?php

declare(strict_types=1);

namespace App\Services\Notifications;

use App\Jobs\DispatchNotificationJob;
use App\Models\Notification;
use App\Models\NotificationRecipient;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public function store(array $validated, User $sender): Notification
    {
        return Notification::create([...$validated, 'sender_id' => $sender->id]);
    }

    public function update(Notification $notification, array $validated): Notification
    {
        $notification->update($validated);

        return $notification->refresh();
    }

    public function dispatch(Notification $notification): void
    {
        DispatchNotificationJob::dispatch($notification);
    }

    public function delete(Notification $notification): void
    {
        $notification->delete();
    }

    /** @return LengthAwarePaginator<Notification> */
    public function adminList(array $filters): LengthAwarePaginator
    {
        return Notification::query()
            ->withCount('recipients')
            ->with('sender:id,name')
            ->when(isset($filters['status']), fn ($q) => match ($filters['status']) {
                'draft' => $q->whereNull('dispatched_at'),
                'sent' => $q->whereNotNull('dispatched_at'),
                default => $q,
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();
    }

    public function markAsRead(NotificationRecipient $recipient): void
    {
        if ($recipient->read_at !== null) {
            return;
        }

        $recipient->update(['read_at' => now()]);
    }

    public function takeAction(NotificationRecipient $recipient, string $action): void
    {
        DB::transaction(function () use ($recipient, $action): void {
            $recipient->update([
                'action' => $action,
                'acted_at' => now(),
                'read_at' => $recipient->read_at ?? now(),
            ]);
        });
    }

    /** @return array{items: Collection, unread_count: int} */
    public function forUser(User $user): array
    {
        $recipients = NotificationRecipient::where('user_id', $user->id)
            ->with('notification')
            ->orderByRaw('read_at IS NOT NULL')
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        $unreadCount = NotificationRecipient::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return ['items' => $recipients, 'unread_count' => $unreadCount];
    }
}
