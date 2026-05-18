import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface TermsPayload {
    slug: string;
    version: string;
    locale: string;
    content: string;
    published_at: string | null;
}

interface PageProps {
    terms: TermsPayload | null;
    auth?: { user?: { id: number } | null };
    [key: string]: unknown;
}

export default function TermsShow() {
    const { t } = useTranslation();
    const { props } = usePage<PageProps>();
    const { terms, auth } = props;

    const accept = () => {
        router.post('/terms/accept');
    };

    return (
        <>
            <Head title={t('terms.head_title')} />
            <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-10">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('terms.title')}
                    </h1>
                    {terms ? (
                        <p className="text-sm text-muted-foreground">
                            {t('terms.version', { version: terms.version })}
                            {terms.published_at &&
                                ` • ${new Date(terms.published_at).toLocaleDateString()}`}
                        </p>
                    ) : null}
                </header>

                <article className="prose prose-neutral max-w-none whitespace-pre-line text-sm leading-relaxed dark:prose-invert">
                    {terms?.content ?? t('terms.no_terms')}
                </article>

                {terms && auth?.user && (
                    <div className="flex justify-end border-t pt-6">
                        <Button onClick={accept}>{t('terms.accept_button')}</Button>
                    </div>
                )}
            </div>
        </>
    );
}
