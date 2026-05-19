import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePasswordStrength } from '@/hooks/use-password-strength';
import type { PasswordPolicy } from '@/hooks/use-password-strength';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
    value: string;
    policy: PasswordPolicy;
    className?: string;
}

const SCORE_CONFIG = [
    { label: 'password_strength.very_weak', bar: 'bg-destructive', count: 4 },
    { label: 'password_strength.weak',      bar: 'bg-orange-500',  count: 1 },
    { label: 'password_strength.fair',      bar: 'bg-yellow-500',  count: 2 },
    { label: 'password_strength.good',      bar: 'bg-green-500',   count: 3 },
    { label: 'password_strength.strong',    bar: 'bg-green-500',   count: 4 },
] as const;

export function PasswordStrength({ value, policy, className }: PasswordStrengthProps) {
    const { t } = useTranslation();
    const { score, criteria } = usePasswordStrength(value, policy);

    if (!value) {
        return null;
    }

    const config = SCORE_CONFIG[score];

    return (
        <div className={cn('space-y-2', className)}>
            {/* Bar */}
            <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={4}>
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                                i < config.count ? config.bar : 'bg-muted',
                            )}
                        />
                    ))}
                </div>
                <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                    {t(config.label)}
                </span>
            </div>

            {/* Checklist */}
            <ul className="space-y-1">
                {criteria.map((criterion) => (
                    <li key={criterion.key} className="flex items-center gap-1.5 text-xs">
                        {criterion.met ? (
                            <Check className="size-3.5 shrink-0 text-green-500" aria-hidden />
                        ) : (
                            <X className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        )}
                        <span className={criterion.met ? 'text-foreground' : 'text-muted-foreground'}>
                            {criterion.label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
