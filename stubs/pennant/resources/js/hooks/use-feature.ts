import { usePage } from '@inertiajs/react';

export function useFeature(feature: string): boolean {
    const { features } = usePage().props;
    return (features as Record<string, boolean> | undefined)?.[feature] === true;
}
