import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface PasswordPolicy {
    min_length: number;
    require_mixed_case: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
}

export interface PasswordCriterion {
    key: string;
    label: string;
    met: boolean;
}

export interface PasswordStrengthResult {
    score: number; // 0–4
    criteria: PasswordCriterion[];
}

export function usePasswordStrength(value: string, policy: PasswordPolicy): PasswordStrengthResult {
    const { t } = useTranslation();

    return useMemo(() => {
        const criteria: PasswordCriterion[] = [
            {
                key: 'min_length',
                label: t('password_strength.min_length', { count: policy.min_length }),
                met: value.length >= policy.min_length,
            },
            ...(policy.require_mixed_case
                ? [
                      {
                          key: 'mixed_case',
                          label: t('password_strength.mixed_case'),
                          met: /[A-Z]/.test(value) && /[a-z]/.test(value),
                      },
                  ]
                : []),
            ...(policy.require_numbers
                ? [
                      {
                          key: 'numbers',
                          label: t('password_strength.numbers'),
                          met: /[0-9]/.test(value),
                      },
                  ]
                : []),
            ...(policy.require_symbols
                ? [
                      {
                          key: 'symbols',
                          label: t('password_strength.symbols'),
                          met: /[^a-zA-Z0-9]/.test(value),
                      },
                  ]
                : []),
        ];

        const met = criteria.filter((c) => c.met).length;
        const total = criteria.length;
        const score = total > 0 ? Math.round((met / total) * 4) : 0;

        return { score, criteria };
    }, [value, policy, t]);
}
