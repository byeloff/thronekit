import { Head, router } from '@inertiajs/react';
import { Flag, RefreshCw, Search, ToggleLeft, ToggleRight, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index as featureFlagsRoute, update as updateFlag } from '@/routes/admin/feature-flags';
import { update as updateFlagUser } from '@/routes/admin/feature-flags/users';

interface FlagStats {
    name: string;
    label: string;
    active_count: number;
    inactive_count: number;
    default_count: number;
    total_users: number;
}

interface FlagUser {
    id: number;
    name: string;
    email: string;
    flag_value: 'active' | 'inactive' | 'default';
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
}

interface Props {
    flags: FlagStats[];
    selectedFlag: string | null;
    search: string;
    flagUsers: Paginated<FlagUser> | null;
}

const FLAG_VALUE_BADGE: Record<FlagUser['flag_value'], string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    default: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function AdminFeatureFlagsIndex({ flags, selectedFlag, search, flagUsers }: Props) {
    const { t } = useTranslation();
    const [userSearch, setUserSearch] = useState(search);
    const [processing, setProcessing] = useState<string | null>(null);

    const openUsers = (flagName: string) => {
        router.get(featureFlagsRoute(), { flag: flagName, search: '' }, {
            preserveState: true,
            only: ['selectedFlag', 'flagUsers', 'search'],
        });
        setUserSearch('');
    };

    const closeUsers = () => {
        router.get(featureFlagsRoute(), {}, {
            preserveState: true,
            only: ['selectedFlag', 'flagUsers', 'search'],
        });
    };

    const searchUsers = (value: string) => {
        setUserSearch(value);
        router.get(featureFlagsRoute(), { flag: selectedFlag, search: value || undefined }, {
            preserveState: true,
            replace: true,
            only: ['flagUsers', 'search'],
        });
    };

    const globalAction = (flagName: string, action: 'activate_all' | 'deactivate_all' | 'purge') => {
        const key = `${flagName}.${action}`;

        setProcessing(key);
        router.patch(
            updateFlag(flagName).url,
            { action },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(null),
            },
        );
    };

    const userAction = (flagName: string, userId: number, action: 'activate' | 'deactivate' | 'forget') => {
        const key = `${flagName}.${userId}.${action}`;

        setProcessing(key);
        router.patch(
            updateFlagUser(flagName, userId).url,
            { action },
            {
                preserveScroll: true,
                only: ['flagUsers', 'flags'],
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <>
            <Head title={t('admin.feature_flags.title')} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Flag className="size-6 text-primary" aria-hidden />
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {t('admin.feature_flags.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('admin.feature_flags.description')}
                        </p>
                    </div>
                </div>

                {/* Flags table */}
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.feature_flags.col_flag')}</TableHead>
                                <TableHead className="text-center">{t('admin.feature_flags.col_active')}</TableHead>
                                <TableHead className="text-center">{t('admin.feature_flags.col_inactive')}</TableHead>
                                <TableHead className="text-center">{t('admin.feature_flags.col_default')}</TableHead>
                                <TableHead className="text-right">{t('admin.feature_flags.col_actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flags.map((flag) => (
                                <TableRow key={flag.name}>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium">{flag.label}</span>
                                            <code className="text-xs text-muted-foreground">{flag.name}</code>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            {flag.active_count}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                            {flag.inactive_count}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="text-muted-foreground">
                                            {flag.default_count}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title={t('admin.feature_flags.activate_all')}
                                                disabled={processing !== null}
                                                onClick={() => globalAction(flag.name, 'activate_all')}
                                            >
                                                <ToggleRight className="size-4 text-green-600" aria-hidden />
                                                <span className="ml-1.5 hidden sm:inline">
                                                    {t('admin.feature_flags.activate_all')}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title={t('admin.feature_flags.deactivate_all')}
                                                disabled={processing !== null}
                                                onClick={() => globalAction(flag.name, 'deactivate_all')}
                                            >
                                                <ToggleLeft className="size-4 text-red-600" aria-hidden />
                                                <span className="ml-1.5 hidden sm:inline">
                                                    {t('admin.feature_flags.deactivate_all')}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title={t('admin.feature_flags.purge')}
                                                disabled={processing !== null}
                                                onClick={() => globalAction(flag.name, 'purge')}
                                            >
                                                <RefreshCw className="size-4 text-amber-600" aria-hidden />
                                                <span className="ml-1.5 hidden sm:inline">
                                                    {t('admin.feature_flags.purge')}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openUsers(flag.name)}
                                            >
                                                <Users className="size-4" aria-hidden />
                                                <span className="ml-1.5 hidden sm:inline">
                                                    {t('admin.feature_flags.manage_users')}
                                                </span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Per-user overrides dialog */}
            <Dialog open={selectedFlag !== null} onOpenChange={(open) => !open && closeUsers()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t('admin.feature_flags.users_dialog_title', {
                                flag: flags.find((f) => f.name === selectedFlag)?.label ?? selectedFlag ?? '',
                            })}
                        </DialogTitle>
                        <DialogDescription>
                            {t('admin.feature_flags.users_dialog_description')}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <Input
                            className="pl-9"
                            placeholder={t('admin.feature_flags.users_search_placeholder')}
                            value={userSearch}
                            onChange={(e) => searchUsers(e.target.value)}
                        />
                    </div>

                    {/* Users list */}
                    {flagUsers ? (
                        <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '360px' }}>
                            {flagUsers.data.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between rounded-lg border px-4 py-2.5"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${FLAG_VALUE_BADGE[user.flag_value]}`}>
                                            {t(`admin.feature_flags.value_${user.flag_value}`)}
                                        </span>

                                        {user.flag_value !== 'active' && selectedFlag && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-green-600 hover:text-green-700"
                                                disabled={processing !== null}
                                                onClick={() => userAction(selectedFlag, user.id, 'activate')}
                                            >
                                                <ToggleRight className="size-3.5" aria-hidden />
                                            </Button>
                                        )}
                                        {user.flag_value !== 'inactive' && selectedFlag && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                                                disabled={processing !== null}
                                                onClick={() => userAction(selectedFlag, user.id, 'deactivate')}
                                            >
                                                <ToggleLeft className="size-3.5" aria-hidden />
                                            </Button>
                                        )}
                                        {user.flag_value !== 'default' && selectedFlag && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700"
                                                title={t('admin.feature_flags.forget_user')}
                                                disabled={processing !== null}
                                                onClick={() => userAction(selectedFlag, user.id, 'forget')}
                                            >
                                                <X className="size-3.5" aria-hidden />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {flagUsers.data.length === 0 && (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    {t('admin.feature_flags.users_empty')}
                                </p>
                            )}

                            {/* Pagination */}
                            {flagUsers.last_page > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!flagUsers.prev_page_url}
                                        onClick={() => flagUsers.prev_page_url && router.visit(flagUsers.prev_page_url, { only: ['flagUsers'] })}
                                    >
                                        ←
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        {flagUsers.current_page} / {flagUsers.last_page}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!flagUsers.next_page_url}
                                        onClick={() => flagUsers.next_page_url && router.visit(flagUsers.next_page_url, { only: ['flagUsers'] })}
                                    >
                                        →
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center py-8">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
