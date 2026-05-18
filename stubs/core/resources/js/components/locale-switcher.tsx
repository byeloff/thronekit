import { router, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AvailableLocale, SupportedLocale } from '@/i18n';
import { cn } from '@/lib/utils';

interface SharedProps {
    locale?: SupportedLocale;
    availableLocales?: AvailableLocale[];
    [key: string]: unknown;
}

interface LocaleSwitcherProps {
    /** Classes adicionais para o botão trigger — útil em páginas com tema fora do design system (ex.: welcome). */
    triggerClassName?: string;
}

export function LocaleSwitcher({ triggerClassName }: LocaleSwitcherProps = {}) {
    const { t } = useTranslation();
    const { locale, availableLocales = [] } = usePage<SharedProps>().props;

    const handleSelect = (next: SupportedLocale) => {
        if (next === locale) {
            return;
        }

        router.put(
            '/locale',
            { locale: next },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8', triggerClassName)}
                    aria-label={t('locale.change')}
                >
                    <Languages className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t('locale.label')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableLocales.map((option) => (
                    <DropdownMenuItem
                        key={option.code}
                        onSelect={() => handleSelect(option.code)}
                        className={option.code === locale ? 'font-semibold' : ''}
                    >
                        <span className="mr-2" aria-hidden>
                            {option.flag}
                        </span>
                        <span>{option.native}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
