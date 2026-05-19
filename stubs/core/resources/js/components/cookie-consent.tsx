import { Link, router } from '@inertiajs/react';
import { Cookie } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ConsentState {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

interface CookieConsentProps {
    initialConsent: ConsentState | null;
}

export function CookieConsent({ initialConsent }: CookieConsentProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(initialConsent === null);
    const [showDetails, setShowDetails] = useState(false);
    const [analytics, setAnalytics] = useState(initialConsent?.analytics ?? false);
    const [marketing, setMarketing] = useState(initialConsent?.marketing ?? false);

    useEffect(() => {
        return router.on('navigate', (event) => {
            const next = event.detail.page.props.cookieConsent as ConsentState | null;
            setOpen(next === null);
            setAnalytics(next?.analytics ?? false);
            setMarketing(next?.marketing ?? false);
        });
    }, []);

    if (!open) {
        return null;
    }

    const submit = (payload: { analytics: boolean; marketing: boolean }) => {
        router.put('/cookie-consent', payload, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const acceptAll = () => submit({ analytics: true, marketing: true });
    const rejectAll = () => submit({ analytics: false, marketing: false });
    const acceptSelected = () => submit({ analytics, marketing });

    return (
        <div
            role="dialog"
            aria-labelledby="cookie-consent-title"
            className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur md:inset-x-4 md:bottom-4 md:left-auto md:max-w-md md:rounded-lg md:border"
        >
            <div className="flex items-start gap-3">
                <Cookie className="mt-1 size-5 shrink-0 text-muted-foreground" aria-hidden />
                <div className="flex-1 space-y-3 text-sm">
                    <div>
                        <h2 id="cookie-consent-title" className="font-semibold">
                            {t('cookies.title')}
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            {t('cookies.description')}{' '}
                            <Link
                                href="/privacy-policy"
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                {t('cookies.privacy_policy_link')}
                            </Link>
                        </p>
                    </div>

                    {showDetails && (
                        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                            <div className="flex items-start gap-3">
                                <Checkbox id="cookie-essential" checked disabled />
                                <div className="grid gap-1 leading-tight">
                                    <Label htmlFor="cookie-essential" className="text-sm">
                                        {t('cookies.essential')}
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        {t('cookies.essential_desc')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="cookie-analytics"
                                    checked={analytics}
                                    onCheckedChange={(v) => setAnalytics(v === true)}
                                />
                                <div className="grid gap-1 leading-tight">
                                    <Label htmlFor="cookie-analytics" className="text-sm">
                                        {t('cookies.analytics')}
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        {t('cookies.analytics_desc')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="cookie-marketing"
                                    checked={marketing}
                                    onCheckedChange={(v) => setMarketing(v === true)}
                                />
                                <div className="grid gap-1 leading-tight">
                                    <Label htmlFor="cookie-marketing" className="text-sm">
                                        {t('cookies.marketing')}
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        {t('cookies.marketing_desc')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {!showDetails ? (
                            <>
                                <Button size="sm" onClick={acceptAll}>
                                    {t('cookies.accept_all')}
                                </Button>
                                <Button size="sm" variant="outline" onClick={rejectAll}>
                                    {t('cookies.reject_all')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowDetails(true)}
                                >
                                    {t('cookies.customize')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="sm" onClick={acceptSelected}>
                                    {t('cookies.save_selection')}
                                </Button>
                                <Button size="sm" variant="outline" onClick={rejectAll}>
                                    {t('cookies.reject_all')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className="mt-3 pl-8 text-xs text-muted-foreground">
                {t('cookies.guest_note')}
            </p>
        </div>
    );
}
