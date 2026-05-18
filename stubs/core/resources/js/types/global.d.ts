import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            isLocal: boolean;
            cookieConsent: {
                essential: boolean;
                analytics: boolean;
                marketing: boolean;
            } | null;
            features: Record<string, boolean>;
            // [thronekit:pennant-features-type]
            [key: string]: unknown;
        };
    }
}
