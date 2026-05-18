import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';

type ErrorConfig = {
    title: string;
    description: string;
};

const STATUS_CODES = [403, 404, 419, 429, 500, 503] as const;
type KnownStatus = (typeof STATUS_CODES)[number];

function isKnownStatus(status: number): status is KnownStatus {
    return (STATUS_CODES as readonly number[]).includes(status);
}

export default function ErrorPage({ status }: { status: number }) {
    const { t } = useTranslation();

    const config: Record<KnownStatus, ErrorConfig> = {
        403: {
            title: t('errors.403.title'),
            description: t('errors.403.description'),
        },
        404: {
            title: t('errors.404.title'),
            description: t('errors.404.description'),
        },
        419: {
            title: t('errors.419.title'),
            description: t('errors.419.description'),
        },
        429: {
            title: t('errors.429.title'),
            description: t('errors.429.description'),
        },
        500: {
            title: t('errors.500.title'),
            description: t('errors.500.description'),
        },
        503: {
            title: t('errors.503.title'),
            description: t('errors.503.description'),
        },
    };

    const { title, description } = isKnownStatus(status)
        ? config[status]
        : { title: t('errors.default.title'), description: t('errors.default.description') };

    const showRefresh = status === 419 || status === 503;
    const showHome = status !== 419 && status !== 503;
    const showBack = status === 403 || status === 404 || status === 429;

    return (
        <>
            <Head title={`${status} — ${title}`} />

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
                <div className="mb-8">
                    <a href="/" className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                        </div>
                    </a>
                </div>

                <div className="text-center">
                    <p className="text-[8rem] leading-none font-bold text-muted-foreground/20 select-none">
                        {status}
                    </p>

                    <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>

                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        {description}
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-3">
                        {showRefresh && (
                            <Button onClick={() => window.location.reload()}>
                                {t('errors.action.refresh')}
                            </Button>
                        )}
                        {showHome && (
                            <Button onClick={() => router.visit('/')}>
                                {t('errors.action.go_home')}
                            </Button>
                        )}
                        {showBack && (
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                {t('errors.action.go_back')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
