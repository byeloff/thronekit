import { usePage } from '@inertiajs/react';
import { startTransition, useCallback, useEffect, useRef, useState } from 'react';

export type NotificationType = 'info' | 'action' | 'link';

export interface UserNotification {
    id: number;
    notification_id: number;
    title: string;
    body: string;
    type: NotificationType;
    data: Record<string, string> | null;
    read_at: string | null;
    action: string | null;
    created_at: string | null;
}

interface NotificationsPageProps {
    auth: { user: { id: number } };
    unreadNotificationCount?: number;
    [key: string]: unknown;
}

export function useNotifications() {
    const { auth, unreadNotificationCount } = usePage<NotificationsPageProps>().props;
    const userId = auth?.user?.id;

    const [items, setItems] = useState<UserNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(unreadNotificationCount ?? 0);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const channelRef = useRef<ReturnType<typeof window.Echo.private> | null>(null);

    // Sync count from Inertia shared prop on navigation
    useEffect(() => {
        startTransition(() => {
            setUnreadCount(unreadNotificationCount ?? 0);
        });
    }, [unreadNotificationCount]);

    // Subscribe to private channel
    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !window.Echo) {
return;
}

        const channel = window.Echo.private(`App.Models.User.${userId}`);
        channelRef.current = channel;

        channel.listen('.NotificationReceived', (data: UserNotification) => {
            setItems((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            window.Echo.leaveChannel(`private-App.Models.User.${userId}`);
            channelRef.current = null;
        };
    }, [userId]);

    const load = useCallback(async () => {
        if (loaded || loading || !userId) {
return;
}

        setLoading(true);

        try {
            const res = await fetch('/notifications', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });

            if (!res.ok) {
return;
}

            const json = await res.json();
            setItems(json.data ?? []);
            setUnreadCount(json.unread_count ?? 0);
            setLoaded(true);
        } finally {
            setLoading(false);
        }
    }, [loaded, loading, userId]);

    const markAsRead = useCallback(async (recipientId: number) => {
        setItems((prev) =>
            prev.map((n) =>
                n.id === recipientId ? { ...n, read_at: new Date().toISOString() } : n,
            ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await fetch(`/notifications/${recipientId}/read`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
    }, []);

    const takeAction = useCallback(async (recipientId: number, action: 'yes' | 'no' | 'clicked') => {
        setItems((prev) =>
            prev.map((n) =>
                n.id === recipientId
                    ? { ...n, action, read_at: n.read_at ?? new Date().toISOString() }
                    : n,
            ),
        );
        setUnreadCount((prev) =>
            items.find((n) => n.id === recipientId)?.read_at ? prev : Math.max(0, prev - 1),
        );

        await fetch(`/notifications/${recipientId}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ action }),
        });
    }, [items]);

    return { items, unreadCount, loading, load, markAsRead, takeAction };
}

function getCsrfToken(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}
