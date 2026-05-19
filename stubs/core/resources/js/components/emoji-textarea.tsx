import data from '@emoji-mart/data';
import EmojiMartPicker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// emoji-mart ainda não publicou tipos para React 19
 
const Picker = EmojiMartPicker as React.ComponentType<any>;

interface EmojiSelection {
    native: string;
}

interface Props {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
}

function getTheme(): 'dark' | 'light' {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getLocale(lang: string): string {
    if (lang.startsWith('pt')) {
return 'pt';
}

    if (lang.startsWith('es')) {
return 'es';
}

    return 'en';
}

export function EmojiTextarea({ id, value, onChange, placeholder, rows = 4, className }: Props) {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const cursorRef = useRef<number>(value.length);

    const saveCursor = () => {
        if (textareaRef.current) {
            cursorRef.current = textareaRef.current.selectionStart ?? value.length;
        }
    };

    const handleEmojiSelect = (emoji: EmojiSelection) => {
        const pos = cursorRef.current;
        const next = value.slice(0, pos) + emoji.native + value.slice(pos);
        onChange(next);
        setOpen(false);
        const newPos = pos + [...emoji.native].length;
        requestAnimationFrame(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(newPos, newPos);
            cursorRef.current = newPos;
        });
    };

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                id={id}
                value={value}
                rows={rows}
                onChange={(e) => {
                    saveCursor();
                    onChange(e.target.value);
                }}
                onKeyUp={saveCursor}
                onClick={saveCursor}
                onSelect={saveCursor}
                placeholder={placeholder}
                className={cn(
                    'field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
                    className,
                )}
            />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2 size-6 text-muted-foreground hover:text-foreground"
                        onClick={saveCursor}
                    >
                        <Smile className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto border-none p-0 shadow-xl"
                    align="end"
                    side="top"
                    sideOffset={8}
                >
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        locale={getLocale(i18n.language)}
                        theme={getTheme()}
                        previewPosition="none"
                        skinTonePosition="none"
                        maxFrequentRows={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
