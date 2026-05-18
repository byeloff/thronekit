import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Search, Shield, UserCog } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { update as updateRoles } from '@/routes/admin/users/roles';
import type { AdminUser, AppRole, Auth } from '@/types';

interface Props {
    users: {
        data: AdminUser[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    roles: AppRole[];
    filters: { search?: string; role?: string };
}

const ROLE_COLORS: Record<AppRole, string> = {
    superadmin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    b2b: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    b2c: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

export default function AdminUsersIndex({ users, roles, filters }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<{ auth: Auth }>().props;
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const form = useForm<{ roles: AppRole[] }>({ roles: [] });

    const openEdit = (user: AdminUser) => {
        setEditing(user);
        form.setData('roles', user.roles);
    };

    const closeEdit = () => {
        setEditing(null);
        form.reset();
    };

    const saveRoles = () => {
        if (!editing) {
            return;
        }

        form.put(updateRoles(editing.id).url, {
            preserveScroll: true,
            onSuccess: closeEdit,
        });
    };

    const applySearch = (value: string) => {
        router.get('/admin/users', { search: value || undefined, role: filters.role || undefined }, {
            preserveState: true,
            replace: true,
        });
    };

    const applyRoleFilter = (value: string) => {
        router.get('/admin/users', { search: filters.search || undefined, role: value === 'all' ? undefined : value }, {
            preserveState: true,
            replace: true,
        });
    };

    const toggleRole = (role: AppRole, checked: boolean) => {
        const current = form.data.roles;

        form.setData('roles', checked
            ? [...current, role]
            : current.filter((r) => r !== role),
        );
    };

    return (
        <>
            <Head title={t('admin.users.title')} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Shield className="size-6 text-primary" aria-hidden />
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {t('admin.users.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('admin.users.total', { total: users.total })}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <Input
                            className="pl-9"
                            placeholder={t('admin.users.search_placeholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applySearch(search)}
                            onBlur={() => applySearch(search)}
                        />
                    </div>
                    <Select
                        value={filters.role ?? 'all'}
                        onValueChange={applyRoleFilter}
                    >
                        <SelectTrigger className="w-full sm:w-44">
                            <SelectValue placeholder={t('admin.users.filter_all')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('admin.users.filter_all')}</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    {t('admin.users.table.name')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    {t('admin.users.table.roles')}
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                                    {t('admin.users.table.verified')}
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                                    {t('admin.users.table.joined')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                    {t('admin.users.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        {t('admin.users.no_users')}
                                    </td>
                                </tr>
                            )}
                            {users.data.map((user) => {
                                const isSelf = user.id === auth.user.id;
                                const isAnonymized = user.anonymized_at !== null;

                                return (
                                    <tr key={user.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium">
                                                    {user.name}
                                                    {isSelf && (
                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                            ({t('admin.users.you')})
                                                        </span>
                                                    )}
                                                    {isAnonymized && (
                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                            {t('admin.users.anonymized')}
                                                        </Badge>
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length === 0 ? (
                                                    <span className="text-xs text-muted-foreground">
                                                        {t('admin.users.no_role')}
                                                    </span>
                                                ) : (
                                                    user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[role] ?? 'bg-muted text-muted-foreground'}`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-3 sm:table-cell">
                                            <span className={user.email_verified_at ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                                                {user.email_verified_at ? '✓' : '–'}
                                            </span>
                                        </td>
                                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                            {user.created_at
                                                ? new Date(user.created_at).toLocaleDateString()
                                                : '–'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEdit(user)}
                                                aria-label={t('admin.users.edit_roles')}
                                            >
                                                <UserCog className="size-4" aria-hidden />
                                                <span className="ml-1.5 hidden sm:inline">
                                                    {t('admin.users.edit_roles')}
                                                </span>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!users.prev_page_url}
                            onClick={() => users.prev_page_url && router.visit(users.prev_page_url)}
                        >
                            ←
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {users.current_page} / {users.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!users.next_page_url}
                            onClick={() => users.next_page_url && router.visit(users.next_page_url)}
                        >
                            →
                        </Button>
                    </div>
                )}
            </div>

            {/* Edit roles dialog */}
            <Dialog open={editing !== null} onOpenChange={(open) => !open && closeEdit()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t('admin.users.dialog_title', { name: editing?.name ?? '' })}
                        </DialogTitle>
                        <DialogDescription>
                            {t('admin.users.dialog_description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3 py-2">
                        {roles.map((role) => {
                            const checked = form.data.roles.includes(role);

                            return (
                                <label
                                    key={role}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                                >
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(val) => toggleRole(role, Boolean(val))}
                                    />
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[role]}`}>
                                        {role}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeEdit}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={saveRoles} disabled={form.processing}>
                            {t('admin.users.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
