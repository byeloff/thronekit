import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { router } from '@inertiajs/react';

let visitorId: string | null = null;

/**
 * Inicializa o FingerprintJS Free e injeta o visitorId como header X-Fingerprint
 * em todas as requisições do Inertia router. Roda apenas no browser.
 * O visitorId fica em memória (não em localStorage).
 */
export function initFingerprint(): void {
    if (typeof window === 'undefined') {
        return;
    }

    router.on('before', (event) => {
        if (visitorId) {
            event.detail.visit.headers['X-Fingerprint'] = visitorId;
        }
    });

    FingerprintJS.load()
        .then((fp) => fp.get())
        .then((result) => {
            visitorId = result.visitorId;
        })
        .catch(() => {
            // Silenciosamente ignorado — o middleware lida com ausência do header.
        });
}

export function getVisitorId(): string | null {
    return visitorId;
}
