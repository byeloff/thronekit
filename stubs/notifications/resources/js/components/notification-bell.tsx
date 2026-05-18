import { Bell, BellOff } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import {  useNotifications } from '@/hooks/use-notifications';
import type {UserNotification} from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

function relativeTime(dateStr: string | null, lang: string): string {
    if (!dateStr) {
return '';
}

    const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(lang.replace('_', '-'), { numeric: 'auto' });
    const abs = Math.abs(diff);

    if (abs < 60) {
return rtf.format(Math.round(diff), 'second');
}

    if (abs < 3600) {
return rtf.format(Math.round(diff / 60), 'minute');
}

    if (abs < 86400) {
return rtf.format(Math.round(diff / 3600), 'hour');
}

    return rtf.format(Math.round(diff / 86400), 'day');
}

function NotificationItem({
    item,
    onRead,
    onAction,
}: {
    item: UserNotification;
    onRead: (id: number) => void;
    onAction: (id: number, action: 'yes' | 'no' | 'clicked') => void;
}) {
    const { t, i18n } = useTranslation();
    const isRead = item.read_at !== null;

    return (
        <div
            className={cn(
                'flex flex-col gap-1.5 border-b border-border/50 px-4 py-3 last:border-0',
                !isRead && 'bg-primary/5',
            )}
            onClick={() => !isRead && onRead(item.id)}
        >
            <div className="flex items-start justify-between gap-2">
                <p className={cn('text-sm leading-snug', !isRead && 'font-medium')}>{item.title}</p>
                {!isRead && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">{item.body}</p>

            {item.type === 'action' && item.action === null && (
                <div className="flex gap-2 pt-1">
                    <Button
                        size="sm"
                        variant="default"
                        className="h-7 px-3 text-xs"
                        onClick={(e) => {
 e.stopPropagation(); onAction(item.id, 'yes'); 
}}
                    >
                        {item.data?.yes_label ?? t('notifications.action_yes')}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs"
                        onClick={(e) => {
 e.stopPropagation(); onAction(item.id, 'no'); 
}}
                    >
                        {item.data?.no_label ?? t('notifications.action_no')}
                    </Button>
                </div>
            )}

            {item.type === 'action' && item.action !== null && (
                <p className="text-xs text-muted-foreground italic">
                    {t('notifications.read_at')}: {item.action}
                </p>
            )}

            {item.type === 'link' && item.data?.url && (
                <a
                    href={item.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-xs text-primary underline underline-offset-2"
                    onClick={(e) => {
 e.stopPropagation(); onAction(item.id, 'clicked'); 
}}
                >
                    {item.data.label ?? t('notifications.action_link')}
                </a>
            )}

            <p className="text-[11px] text-muted-foreground/70">
                {relativeTime(item.created_at, i18n.language)}
            </p>
        </div>
    );
}

export function NotificationBell() {
    const { t } = useTranslation();
    const { items, unreadCount, loading, load, markAsRead, takeAction } = useNotifications();
    const { soundEnabled, toggleSound, playSound } = useNotificationSound();

    const prevUnreadRef = useRef<number | null>(null);

    useEffect(() => {
        if (prevUnreadRef.current === null) {
            prevUnreadRef.current = unreadCount;

            return;
        }

        if (unreadCount > prevUnreadRef.current) {
            playSound();
        }

        prevUnreadRef.current = unreadCount;
    }, [unreadCount, playSound]);

    return (
        <DropdownMenu onOpenChange={(open) => open && load()}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                    aria-label={t('notifications.bell_label')}
                >
                    <Bell className="size-5 opacity-80" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
                    <p className="text-sm font-semibold">{t('notifications.bell_label')}</p>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {t('notifications.unread_count', { count: unreadCount })}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground"
                            title={soundEnabled ? t('notifications.sound_on') : t('notifications.sound_off')}
                            onClick={toggleSound}
                        >
                            {soundEnabled ? <Bell className="size-3.5" /> : <BellOff className="size-3.5" />}
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[360px]">
                    {loading && (
                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                            {t('common.loading')}…
                        </p>
                    )}

                    {!loading && items.length === 0 && (
                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                            {t('notifications.empty')}
                        </p>
                    )}

                    {items.map((item) => (
                        <NotificationItem
                            key={item.id}
                            item={item}
                            onRead={markAsRead}
                            onAction={takeAction}
                        />
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
