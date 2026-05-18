import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmojiTextarea } from '@/components/emoji-textarea';
import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    name: string;
    email: string;
}

interface NotificationFormData {
    title: string;
    body: string;
    type: string;
    data: { yes_label?: string; no_label?: string; url?: string; label?: string };
    target_type: string;
    target_roles: string[];
    target_user_ids: number[];
}

interface Props {
    defaultValues?: Partial<NotificationFormData>;
    types: string[];
    targets: string[];
    roles: string[];
    users: User[];
    action: string;
    method?: 'post' | 'put';
    onSuccess?: () => void;
}

/* ─── Preview card ────────────────────────────────────────────── */

function PreviewCard({ title, body, type, data }: Pick<NotificationFormData, 'title' | 'body' | 'type' | 'data'>) {
    const { t } = useTranslation();

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            {/* mock bell header */}
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                <p className="text-xs font-semibold text-muted-foreground">{t('notifications.bell_label')}</p>
                <Badge variant="outline" className="text-[10px]">preview</Badge>
            </div>

            <div className="flex flex-col gap-1.5 bg-primary/5 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium leading-snug', !title && 'italic text-muted-foreground')}>
                        {title || t('admin.notifications.form.title_placeholder')}
                    </p>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                </div>

                <p className={cn('text-xs text-muted-foreground', !body && 'italic')}>
                    {body || t('admin.notifications.form.body_placeholder')}
                </p>

                {type === 'action' && (
                    <div className="flex gap-2 pt-1">
                        <Button size="sm" className="pointer-events-none h-7 px-3 text-xs">
                            {data.yes_label || t('notifications.action_yes')}
                        </Button>
                        <Button size="sm" variant="outline" className="pointer-events-none h-7 px-3 text-xs">
                            {data.no_label || t('notifications.action_no')}
                        </Button>
                    </div>
                )}

                {type === 'link' && data.url && (
                    <span className="w-fit text-xs text-primary underline underline-offset-2">
                        {data.label || t('notifications.action_link')}
                    </span>
                )}

                <p className="text-[11px] text-muted-foreground/70">{t('notifications.just_now')}</p>
            </div>
        </div>
    );
}

/* ─── Main form ───────────────────────────────────────────────── */

export function NotificationForm({ defaultValues, types, targets, roles, users, action, method = 'post', onSuccess }: Props) {
    const { t } = useTranslation();
    const [showPreview, setShowPreview] = useState(false);

    const form = useForm<NotificationFormData>({
        title: defaultValues?.title ?? '',
        body: defaultValues?.body ?? '',
        type: defaultValues?.type ?? 'info',
        data: defaultValues?.data ?? {},
        target_type: defaultValues?.target_type ?? 'all',
        target_roles: defaultValues?.target_roles ?? [],
        target_user_ids: defaultValues?.target_user_ids ?? [],
    });

    /* Open preview on submit instead of sending immediately */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowPreview(true);
    };

    const submit = (dispatchImmediately: boolean) => {
        setShowPreview(false);
        form.transform((d) => ({ ...d, dispatch_immediately: dispatchImmediately }));
        const opts = { onSuccess };

        if (method === 'put') {
            form.put(action, opts);
        } else {
            form.post(action, opts);
        }
    };

    const toggleRole = (role: string) => {
        const current = form.data.target_roles;
        form.setData(
            'target_roles',
            current.includes(role) ? current.filter((r) => r !== role) : [...current, role],
        );
    };

    const toggleUser = (id: number) => {
        const current = form.data.target_user_ids;
        form.setData(
            'target_user_ids',
            current.includes(id) ? current.filter((u) => u !== id) : [...current, id],
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="title">{t('admin.notifications.form.title')}</Label>
                    <Input
                        id="title"
                        value={form.data.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('title', e.target.value)}
                        placeholder={t('admin.notifications.form.title_placeholder')}
                    />
                    <InputError message={form.errors.title} />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="body">{t('admin.notifications.form.body')}</Label>
                    <EmojiTextarea
                        id="body"
                        rows={4}
                        value={form.data.body}
                        onChange={(v) => form.setData('body', v)}
                        placeholder={t('admin.notifications.form.body_placeholder')}
                    />
                    <InputError message={form.errors.body} />
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                    <Label>{t('admin.notifications.form.type')}</Label>
                    <RadioGroup
                        value={form.data.type}
                        onValueChange={(v: string) => form.setData('type', v)}
                        className="flex gap-4"
                    >
                        {types.map((type) => (
                            <div key={type} className="flex items-center gap-2">
                                <RadioGroupItem value={type} id={`type-${type}`} />
                                <Label htmlFor={`type-${type}`} className="cursor-pointer font-normal">
                                    {t(`admin.notifications.form.type_${type}`)}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <InputError message={form.errors.type} />
                </div>

                {/* Action fields */}
                {form.data.type === 'action' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="yes_label">{t('admin.notifications.form.yes_label')}</Label>
                            <Input
                                id="yes_label"
                                value={form.data.data.yes_label ?? ''}
                                onChange={(e) => form.setData('data', { ...form.data.data, yes_label: e.target.value })}
                            />
                            <InputError message={form.errors['data.yes_label']} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="no_label">{t('admin.notifications.form.no_label')}</Label>
                            <Input
                                id="no_label"
                                value={form.data.data.no_label ?? ''}
                                onChange={(e) => form.setData('data', { ...form.data.data, no_label: e.target.value })}
                            />
                            <InputError message={form.errors['data.no_label']} />
                        </div>
                    </div>
                )}

                {/* Link fields */}
                {form.data.type === 'link' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="link_url">{t('admin.notifications.form.link_url')}</Label>
                            <Input
                                id="link_url"
                                value={form.data.data.url ?? ''}
                                onChange={(e) => form.setData('data', { ...form.data.data, url: e.target.value })}
                                placeholder="https://"
                            />
                            <InputError message={form.errors['data.url']} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="link_label">{t('admin.notifications.form.link_label')}</Label>
                            <Input
                                id="link_label"
                                value={form.data.data.label ?? ''}
                                onChange={(e) => form.setData('data', { ...form.data.data, label: e.target.value })}
                            />
                            <InputError message={form.errors['data.label']} />
                        </div>
                    </div>
                )}

                {/* Target */}
                <div className="flex flex-col gap-1.5">
                    <Label>{t('admin.notifications.form.target')}</Label>
                    <RadioGroup
                        value={form.data.target_type}
                        onValueChange={(v: string) => form.setData('target_type', v)}
                        className="flex gap-4"
                    >
                        {targets.map((target) => (
                            <div key={target} className="flex items-center gap-2">
                                <RadioGroupItem value={target} id={`target-${target}`} />
                                <Label htmlFor={`target-${target}`} className="cursor-pointer font-normal">
                                    {t(`admin.notifications.form.target_${target}`)}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <InputError message={form.errors.target_type} />
                </div>

                {/* Role selection */}
                {form.data.target_type === 'role' && (
                    <div className="flex flex-col gap-2">
                        <Label>{t('admin.notifications.form.target_roles_label')}</Label>
                        <div className="flex flex-wrap gap-3">
                            {roles.map((role) => (
                                <div key={role} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`role-${role}`}
                                        checked={form.data.target_roles.includes(role)}
                                        onCheckedChange={() => toggleRole(role)}
                                    />
                                    <Label htmlFor={`role-${role}`} className="cursor-pointer font-normal capitalize">
                                        {role}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={form.errors.target_roles} />
                    </div>
                )}

                {/* User selection */}
                {form.data.target_type === 'specific' && (
                    <div className="flex flex-col gap-2">
                        <Label>{t('admin.notifications.form.target_users_label')}</Label>
                        <div className="max-h-48 overflow-y-auto rounded-md border p-3 flex flex-col gap-2">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`user-${user.id}`}
                                        checked={form.data.target_user_ids.includes(user.id)}
                                        onCheckedChange={() => toggleUser(user.id)}
                                    />
                                    <Label htmlFor={`user-${user.id}`} className="cursor-pointer font-normal">
                                        {user.name}
                                        <span className="ml-1 text-xs text-muted-foreground">({user.email})</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={form.errors.target_user_ids} />
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {t('admin.notifications.form.preview')}
                    </Button>
                </div>
            </form>

            {/* Preview & send dialog */}
            <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.notifications.form.preview_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('admin.notifications.form.preview_description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <PreviewCard
                        title={form.data.title}
                        body={form.data.body}
                        type={form.data.type}
                        data={form.data.data}
                    />

                    <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <AlertDialogCancel onClick={() => setShowPreview(false)}>
                            {t('admin.notifications.form.back_to_edit')}
                        </AlertDialogCancel>
                        <Button
                            variant="outline"
                            disabled={form.processing}
                            onClick={() => submit(false)}
                        >
                            {t('admin.notifications.form.save_draft')}
                        </Button>
                        <Button
                            disabled={form.processing}
                            onClick={() => submit(true)}
                            className="gap-2"
                        >
                            <Send className="size-3.5" />
                            {t('admin.notifications.form.save_and_send')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
