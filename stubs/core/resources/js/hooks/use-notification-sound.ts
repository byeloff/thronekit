import { useCallback, useState } from 'react';

const STORAGE_KEY = 'vibbe:notifications:sound';

function playChime(): void {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.55);
        osc.onended = () => ctx.close();
    } catch {
        // AudioContext not available (e.g. SSR, browser restrictions)
    }
}

export function useNotificationSound() {
    const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) !== 'false';
        } catch {
            return true;
        }
    });

    const toggleSound = useCallback(() => {
        setSoundEnabled((prev) => {
            const next = !prev;

            try {
                localStorage.setItem(STORAGE_KEY, String(next));
            } catch {
                // ignore — localStorage not available
            }

            return next;
        });
    }, []);

    const playSound = useCallback(() => {
        if (soundEnabled) {
playChime();
}
    }, [soundEnabled]);

    return { soundEnabled, toggleSound, playSound };
}
