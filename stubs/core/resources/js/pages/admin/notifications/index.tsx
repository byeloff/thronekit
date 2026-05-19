import { Head, Link, setLayoutProps, useForm } from '@inertiajs/react';
import { Bell, CheckCircle2, Clock, Eye, Pencil, Plus, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    destroy,
    dispatch as dispatchRoute,
    index,
    show,
    store,
    update,
} from '@/routes/admin/notifications';
import { NotificationForm } from './notification-form';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AdminNotification {
    id: number;
    title: string;
    body: string;
    type: string;
    data: Record<string, string> | null;
    target_type: string;
    target_roles: string[] | null;
    target_user_ids: number[] | null;
    recipients_count: number;
    dispatched_at: string | null;
    created_at: string;
}

interface Props {
    notifications: { data: AdminNotification[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { status?: string };
    types: string[];
    targets: string[];
    roles: string[];
    users: User[];
}

function TypeBadge({ type }: { type: string }) {
    const { t } = useTranslation();
    const colorMap: Record<string, string> = {
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        action: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        link: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[type] ?? ''}`}>
            {t(`admin.notifications.form.type_${type}`)}
        </span>
    );
}

export default function NotificationsIndex({ notifications, filters, types, targets, roles, users }: Props) {
    const { t } = useTranslation();

    setLayoutProps({
        breadcrumbs: [{ title: t('admin.notifications.title'), href: index().url }],
    });

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState<AdminNotification | null>(null);
    const [dispatchTarget, setDispatchTarget] = useState<AdminNotification | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminNotification | null>(null);
    const dispatchForm = useForm({});
    const deleteForm = useForm({});

    const openCreate = () => {
        setEditingNotification(null);
        setDrawerOpen(true);
    };

    const openEdit = (n: AdminNotification) => {
        setEditingNotification(n);
        setDrawerOpen(true);
    };

    const handleDispatch = () => {
        if (!dispatchTarget) {
return;
}

        dispatchForm.post(dispatchRoute(dispatchTarget.id).url, {
            onSuccess: () => setDispatchTarget(null),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) {
return;
}

        deleteForm.delete(destroy(deleteTarget.id).url, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const drawerTitle = editingNotification
        ? t('admin.notifications.edit')
        : t('admin.notifications.new');

    const formAction = editingNotification
        ? update(editingNotification.id).url
        : store().url;

    const formMethod = editingNotification ? 'put' : 'post';

    const formDefaultValues = editingNotification
        ? {
            title: editingNotification.title,
            body: editingNotification.body,
            type: editingNotification.type,
            data: editingNotification.data ?? {},
            target_type: editingNotification.target_type,
            target_roles: editingNotification.target_roles ?? [],
            target_user_ids: editingNotification.target_user_ids ?? [],
        }
        : undefined;

    return (
        <>
            <Head title={t('admin.notifications.title')} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{t('admin.notifications.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('admin.notifications.description')}</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 size-4" />
                        {t('admin.notifications.new')}
                    </Button>
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2">
                    {[
                        { value: '', label: t('admin.notifications.all') },
                        { value: 'draft', label: t('admin.notifications.drafts') },
                        { value: 'sent', label: t('admin.notifications.sent') },
                    ].map(({ value, label }) => (
                        <Link
                            key={value}
                            href={index(value ? { query: { status: value } } : undefined).url}
                            className={`rounded-md px-3 py-1.5 text-sm ${
                                (filters.status ?? '') === value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.notifications.table.title')}</TableHead>
                                <TableHead>{t('admin.notifications.table.type')}</TableHead>
                                <TableHead>{t('admin.notifications.table.target')}</TableHead>
                                <TableHead>{t('admin.notifications.table.status')}</TableHead>
                                <TableHead className="text-right">{t('admin.notifications.table.recipients')}</TableHead>
                                <TableHead className="text-right">{t('admin.notifications.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {notifications.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                        <Bell className="mx-auto mb-2 size-8 opacity-30" />
                                        {t('notifications.empty')}
                                    </TableCell>
                                </TableRow>
                            )}
                            {notifications.data.map((n) => (
                                <TableRow key={n.id}>
                                    <TableCell className="font-medium">{n.title}</TableCell>
                                    <TableCell><TypeBadge type={n.type} /></TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {t(`admin.notifications.form.target_${n.target_type}`)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {n.dispatched_at ? (
                                            <Badge variant="secondary" className="gap-1 text-green-700 dark:text-green-400">
                                                <CheckCircle2 className="size-3" />
                                                {t('admin.notifications.status_sent')}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="size-3" />
                                                {t('admin.notifications.status_draft')}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-sm tabular-nums">
                                        {n.recipients_count}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="size-8" asChild>
                                                <Link href={show(n.id).url}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                            {!n.dispatched_at && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-primary"
                                                        onClick={() => setDispatchTarget(n)}
                                                    >
                                                        <Send className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() => openEdit(n)}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-destructive"
                                                        onClick={() => setDeleteTarget(n)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create / Edit drawer */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                    <div className="flex flex-col gap-6 p-6">
                        <SheetHeader className="p-0">
                            <SheetTitle>{drawerTitle}</SheetTitle>
                        </SheetHeader>
                        <NotificationForm
                            key={editingNotification?.id ?? 'create'}
                            defaultValues={formDefaultValues}
                            types={types}
                            targets={targets}
                            roles={roles}
                            users={users}
                            action={formAction}
                            method={formMethod}
                            onSuccess={() => setDrawerOpen(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Dispatch dialog */}
            <AlertDialog open={!!dispatchTarget} onOpenChange={(o: boolean) => !o && setDispatchTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.notifications.dispatch_confirm')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('admin.notifications.dispatch_confirm_body')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDispatch} disabled={dispatchForm.processing}>
                            {dispatchForm.processing ? t('admin.notifications.dispatching') : t('admin.notifications.dispatch')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(o: boolean) => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.notifications.delete_confirm')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('admin.notifications.delete_confirm_body')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('admin.notifications.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
