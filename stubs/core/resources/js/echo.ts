import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

/**
 * Instancia o Echo apontando pro Reverb. Roda apenas no browser — em SSR
 * (Vite warmup) WebSocket não faz sentido. O singleton é exposto em
 * `window.Echo` para debug rápido e uso por componentes.
 *
 * Variáveis vêm de `import.meta.env`:
 * - VITE_REVERB_APP_KEY: chave pública do app no Reverb.
 * - VITE_REVERB_HOST / VITE_REVERB_PORT / VITE_REVERB_SCHEME: endpoint público
 *   (do ponto de vista do browser — em dev é localhost + porta mapeada).
 */
export function initEcho(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (window.Echo) {
        return;
    }

    window.Pusher = Pusher;

    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}

export type { Echo };
