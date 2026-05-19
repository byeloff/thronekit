import { useEffect } from 'react';
import { toast } from 'sonner';

interface BroadcastTestPayload {
    message: string;
    timestamp: string;
}

/**
 * Componente sem UI — só registra listeners no canal `notifications` do Reverb
 * e dispara toasts. Inclua em layouts autenticados pra ficar ativo nas páginas.
 */
export function RealtimeNotifications() {
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Echo) {
            return;
        }

        const channel = window.Echo.channel('notifications');

        channel.listen('BroadcastTest', (payload: BroadcastTestPayload) => {
            toast.success(payload.message, {
                description: new Date(payload.timestamp).toLocaleTimeString(),
            });
        });

        return () => {
            window.Echo.leave('notifications');
        };
    }, []);

    return null;
}
