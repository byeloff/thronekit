import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { CheckCircle2, Clock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { edit, index, show } from '@/routes/admin/notifications';

interface Recipient {
    id: number;
    user: { id: number; name: string; email: string } | null;
    read_at: string | null;
    action: string | null;
    acted_at: string | null;
    created_at: string | null;
}

interface Notification {
    id: number;
    title: string;
    body: string;
    type: string;
    data: Record<string, string> | null;
    target_type: string;
    recipients_count: number;
    dispatched_at: string | null;
    created_at: string;
}

interface Props {
    notification: Notification;
    recipients: { data: Recipient[]; links: { url: string | null; label: string; active: boolean }[] };
}

function fmt(iso: string | null): string {
    if (!iso) {
return '—';
}

    return new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
}

export default function NotificationShow({ notification, recipients }: Props) {
    const { t } = useTranslation();

    setLayoutProps({
        breadcrumbs: [
            { title: t('admin.notifications.title'), href: index().url },
            { title: notification.title, href: show(notification.id).url },
        ],
    });

    return (
        <>
            <Head title={notification.title} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">{notification.title}</h1>
                        <p className="text-sm text-muted-foreground">{notification.body}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {notification.dispatched_at ? (
                            <Badge variant="secondary" className="gap-1 text-green-700 dark:text-green-400">
                                <CheckCircle2 className="size-3" />
                                {t('admin.notifications.status_sent')} · {fmt(notification.dispatched_at)}
                            </Badge>
                        ) : (
                            <>
                                <Badge variant="outline" className="gap-1">
                                    <Clock className="size-3" />
                                    {t('admin.notifications.status_draft')}
                                </Badge>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={edit(notification.id).url}>
                                        {t('admin.notifications.edit')}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                        {t('admin.notifications.show.recipient_list')} ({notification.recipients_count})
                    </h2>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('admin.notifications.show.user')}</TableHead>
                                    <TableHead>{t('admin.notifications.show.delivered_at')}</TableHead>
                                    <TableHead>{t('admin.notifications.show.read_at')}</TableHead>
                                    <TableHead>{t('admin.notifications.show.action')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recipients.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            <User className="mx-auto mb-2 size-6 opacity-30" />
                                            {t('notifications.empty')}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {recipients.data.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{r.user?.name ?? '—'}</p>
                                                <p className="text-xs text-muted-foreground">{r.user?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{fmt(r.created_at)}</TableCell>
                                        <TableCell className="text-sm">
                                            {r.read_at ? fmt(r.read_at) : <span className="text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell>
                                            {r.action ? (
                                                <Badge variant="outline" className="capitalize">{r.action}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}
