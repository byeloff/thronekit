import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { initI18n } from '@/i18n';

/**
 * Mantém o i18n sincronizado com o locale compartilhado pelo Inertia.
 * Deve ser chamado em todo layout raiz para que a troca de idioma reflita
 * imediatamente na UI, sem precisar de reload manual.
 */
export function useLocaleSync(): void {
    const { locale, translations } = usePage().props as {
        locale?: unknown;
        translations?: Record<string, unknown>;
        [key: string]: unknown;
    };

    useEffect(() => {
        initI18n(locale, translations);
        // Translations muda junto com locale — locale como dep é suficiente.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);
}
