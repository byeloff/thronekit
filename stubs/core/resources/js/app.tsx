import { createInertiaApp } from '@inertiajs/react';
import type { InertiaAppProps } from '@inertiajs/react';
import { StrictMode } from 'react';
import type { ReactElement } from 'react';
import { CookieConsent } from '@/components/cookie-consent';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initEcho } from '@/echo';
import { initFingerprint } from '@/fingerprint';
import { initializeTheme } from '@/hooks/use-appearance';
import { initI18n } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const isBrowser = typeof document !== 'undefined';

// Inicializa o i18n lendo o JSON injetado pelo Inertia v3 em
// `<script data-page="app" type="application/json">...</script>`, ANTES do
// mount do React. Garante que o primeiro render já tenha as traduções.
// Em SSR (Node) não há `document`; nesse caso só registra o fallback.
function bootstrapI18n(): void {
    if (!isBrowser) {
        initI18n('pt_BR', {});

        return;
    }

    const scriptTag = document.querySelector<HTMLScriptElement>(
        'script[data-page="app"]',
    );
    const dataPage = scriptTag?.textContent;

    if (!dataPage) {
        initI18n('pt_BR', {});

        return;
    }

    try {
        const parsed = JSON.parse(dataPage) as { props?: Record<string, unknown> };
        const sharedProps = parsed.props ?? {};
        initI18n(
            sharedProps.locale,
            sharedProps.translations as Record<string, unknown> | undefined,
        );
    } catch {
        initI18n('pt_BR', {});
    }
}

bootstrapI18n();

type CookieConsentState = {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
};

/** withApp recebe `<StrictMode><App /></StrictMode>` quando strictMode está ativo. */
function cookieConsentFromApp(app: ReactElement): CookieConsentState | null {
    const inertiaApp =
        app.type === StrictMode
            ? (app.props as { children: ReactElement }).children
            : app;

    const initialPage = (inertiaApp.props as InertiaAppProps).initialPage;

    return (initialPage.props.cookieConsent as CookieConsentState | null) ?? null;
}

// Conecta o Echo ao Reverb (WebSocket). Só roda no browser.
if (isBrowser) {
    initEcho();
    initFingerprint();
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name.startsWith('errors/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <CookieConsent initialConsent={cookieConsentFromApp(app)} />
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
if (isBrowser) {
    initializeTheme();
}
