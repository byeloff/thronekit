import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TermsPayload {
    slug: string;
    version: string;
    locale: string;
    content: string;
    published_at: string | null;
}

interface AcceptancePayload {
    accepted_at: string;
    ip: string | null;
    user_agent: string | null;
    fingerprint_key: string | null;
}

interface PageProps {
    terms: TermsPayload | null;
    acceptance: AcceptancePayload | null;
    auth?: { user?: { id: number } | null };
    [key: string]: unknown;
}

function AcceptanceDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
            <p className="font-mono text-sm break-all">{value}</p>
        </div>
    );
}

export default function TermsShow() {
    const { t, i18n } = useTranslation();
    const { props } = usePage<PageProps>();
    const { terms, acceptance, auth } = props;

    const accept = () => {
        router.post('/terms/accept');
    };

    const formattedDate = acceptance?.accepted_at
        ? new Intl.DateTimeFormat(i18n.language.replace('_', '-'), {
              dateStyle: 'long',
              timeStyle: 'medium',
          }).format(new Date(acceptance.accepted_at))
        : null;

    const shortFingerprint = acceptance?.fingerprint_key
        ? `${acceptance.fingerprint_key.slice(0, 8)}…${acceptance.fingerprint_key.slice(-8)}`
        : null;

    return (
        <>
            <Head title={t('terms.head_title')} />
            <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-10">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">{t('terms.title')}</h1>
                    {terms ? (
                        <p className="text-muted-foreground text-sm">
                            {t('terms.version', { version: terms.version })}
                            {terms.published_at &&
                                ` • ${new Date(terms.published_at).toLocaleDateString()}`}
                        </p>
                    ) : null}
                </header>

                <article className="prose prose-neutral max-w-none whitespace-pre-line text-sm leading-relaxed dark:prose-invert">
                    {terms?.content ?? t('terms.no_terms')}
                </article>

                {acceptance ? (
                    <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <CardTitle className="text-base text-green-800 dark:text-green-300">
                                    {t('terms.acceptance.title')}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-green-700 dark:text-green-400">
                                {t('terms.acceptance.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator className="bg-green-200 dark:bg-green-800" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                {formattedDate && (
                                    <AcceptanceDetail
                                        label={t('terms.acceptance.accepted_at')}
                                        value={formattedDate}
                                    />
                                )}
                                {acceptance.ip && (
                                    <AcceptanceDetail
                                        label={t('terms.acceptance.ip')}
                                        value={acceptance.ip}
                                    />
                                )}
                                {acceptance.user_agent && (
                                    <div className="sm:col-span-2">
                                        <AcceptanceDetail
                                            label={t('terms.acceptance.user_agent')}
                                            value={acceptance.user_agent}
                                        />
                                    </div>
                                )}
                                {shortFingerprint && (
                                    <div className="sm:col-span-2 space-y-1">
                                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                                            {t('terms.acceptance.fingerprint')}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {shortFingerprint}
                                            </Badge>
                                            <span
                                                className="text-muted-foreground font-mono text-xs hidden sm:block"
                                                title={acceptance.fingerprint_key ?? ''}
                                            >
                                                {acceptance.fingerprint_key}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    terms && auth?.user && (
                        <div className="flex justify-end border-t pt-6">
                            <Button onClick={accept}>{t('terms.accept_button')}</Button>
                        </div>
                    )
                )}
            </div>
        </>
    );
}
