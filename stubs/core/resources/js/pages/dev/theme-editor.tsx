import { router } from '@inertiajs/react';
import { Check, Code2, Copy, Layers, Moon, Palette, SquarePen, Sun, Type } from 'lucide-react';
import { useEffect, useState } from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppearance } from '@/hooks/use-appearance';
import { hexToOklch, isOklch, oklchToHex } from '@/lib/color';
import { cn } from '@/lib/utils';
import dev from '@/routes/dev';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
    light: Record<string, string>;
    dark: Record<string, string>;
    themeVars: Record<string, string>;
}

type TabId = 'colors' | 'typography' | 'radius' | 'shadows' | 'code';

interface Tokens {
    light: Record<string, string>;
    dark: Record<string, string>;
    themeVars: Record<string, string>;
}

interface Preset {
    id: string;
    name: string;
    description: string;
    swatches: string[];
    light: Record<string, string>;
    dark: Record<string, string>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'colors' as TabId, label: 'Cores', icon: Palette },
    { id: 'typography' as TabId, label: 'Tipografia', icon: Type },
    { id: 'radius' as TabId, label: 'Arredondamentos', icon: SquarePen },
    { id: 'shadows' as TabId, label: 'Sombras', icon: Layers },
    { id: 'code' as TabId, label: 'Código', icon: Code2 },
];

const COLOR_GROUPS = [
    { label: 'Base', keys: ['background', 'foreground'] },
    { label: 'Primary', keys: ['primary', 'primary-foreground'] },
    { label: 'Secondary', keys: ['secondary', 'secondary-foreground'] },
    { label: 'Muted', keys: ['muted', 'muted-foreground'] },
    { label: 'Accent', keys: ['accent', 'accent-foreground'] },
    { label: 'Destructive', keys: ['destructive', 'destructive-foreground'] },
    { label: 'Card', keys: ['card', 'card-foreground'] },
    { label: 'Popover', keys: ['popover', 'popover-foreground'] },
    { label: 'Border & Ring', keys: ['border', 'input', 'ring'] },
    {
        label: 'Sidebar',
        keys: ['sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'],
    },
    { label: 'Charts', keys: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
];

const FONT_PRESETS = [
    { label: 'Instrument Sans', value: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif" },
    { label: 'Inter', value: "'Inter', ui-sans-serif, system-ui, sans-serif" },
    { label: 'Geist', value: "'Geist', ui-sans-serif, system-ui, sans-serif" },
    { label: 'Plus Jakarta', value: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" },
    { label: 'Space Grotesk', value: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" },
    { label: 'DM Sans', value: "'DM Sans', ui-sans-serif, system-ui, sans-serif" },
    { label: 'System UI', value: 'ui-sans-serif, system-ui, sans-serif' },
];

const SHADOW_KEYS = [
    { key: 'shadow-sm', label: 'sm' },
    { key: 'shadow', label: 'default' },
    { key: 'shadow-md', label: 'md' },
    { key: 'shadow-lg', label: 'lg' },
    { key: 'shadow-xl', label: 'xl' },
    { key: 'shadow-2xl', label: '2xl' },
];

const PRESETS: Preset[] = [
    {
        id: 'laravel',
        name: 'Laravel',
        description: 'Neutros padrão do Laravel Starter Kit',
        swatches: ['#18181b', '#71717a', '#e4e4e7'],
        light: {
            background: 'oklch(1 0 0)',
            foreground: 'oklch(0.145 0 0)',
            card: 'oklch(1 0 0)',
            'card-foreground': 'oklch(0.145 0 0)',
            popover: 'oklch(1 0 0)',
            'popover-foreground': 'oklch(0.145 0 0)',
            primary: 'oklch(0.205 0 0)',
            'primary-foreground': 'oklch(0.985 0 0)',
            secondary: 'oklch(0.97 0 0)',
            'secondary-foreground': 'oklch(0.205 0 0)',
            muted: 'oklch(0.97 0 0)',
            'muted-foreground': 'oklch(0.556 0 0)',
            accent: 'oklch(0.97 0 0)',
            'accent-foreground': 'oklch(0.205 0 0)',
            destructive: 'oklch(0.577 0.245 27.325)',
            'destructive-foreground': 'oklch(0.985 0 0)',
            border: 'oklch(0.922 0 0)',
            input: 'oklch(0.922 0 0)',
            ring: 'oklch(0.708 0 0)',
            radius: '0.625rem',
            sidebar: 'oklch(0.985 0 0)',
            'sidebar-foreground': 'oklch(0.145 0 0)',
            'sidebar-primary': 'oklch(0.205 0 0)',
            'sidebar-primary-foreground': 'oklch(0.985 0 0)',
            'sidebar-accent': 'oklch(0.97 0 0)',
            'sidebar-accent-foreground': 'oklch(0.205 0 0)',
            'sidebar-border': 'oklch(0.922 0 0)',
            'sidebar-ring': 'oklch(0.708 0 0)',
            'chart-1': 'oklch(0.646 0.222 41.116)',
            'chart-2': 'oklch(0.6 0.118 184.704)',
            'chart-3': 'oklch(0.398 0.07 227.392)',
            'chart-4': 'oklch(0.828 0.189 84.429)',
            'chart-5': 'oklch(0.769 0.188 70.08)',
            'scrollbar-thumb': 'oklch(0.78 0 0)',
            'scrollbar-thumb-hover': 'oklch(0.62 0 0)',
            'scrollbar-track': 'oklch(0.97 0 0)',
        },
        dark: {
            background: 'oklch(0.145 0 0)',
            foreground: 'oklch(0.985 0 0)',
            card: 'oklch(0.205 0 0)',
            'card-foreground': 'oklch(0.985 0 0)',
            popover: 'oklch(0.205 0 0)',
            'popover-foreground': 'oklch(0.985 0 0)',
            primary: 'oklch(0.922 0 0)',
            'primary-foreground': 'oklch(0.205 0 0)',
            secondary: 'oklch(0.269 0 0)',
            'secondary-foreground': 'oklch(0.985 0 0)',
            muted: 'oklch(0.269 0 0)',
            'muted-foreground': 'oklch(0.708 0 0)',
            accent: 'oklch(0.269 0 0)',
            'accent-foreground': 'oklch(0.985 0 0)',
            destructive: 'oklch(0.396 0.141 25.723)',
            'destructive-foreground': 'oklch(0.637 0.237 25.331)',
            border: 'oklch(0.269 0 0)',
            input: 'oklch(0.269 0 0)',
            ring: 'oklch(0.439 0 0)',
            sidebar: 'oklch(0.205 0 0)',
            'sidebar-foreground': 'oklch(0.985 0 0)',
            'sidebar-primary': 'oklch(0.488 0.243 264.376)',
            'sidebar-primary-foreground': 'oklch(0.985 0 0)',
            'sidebar-accent': 'oklch(0.269 0 0)',
            'sidebar-accent-foreground': 'oklch(0.985 0 0)',
            'sidebar-border': 'oklch(0.269 0 0)',
            'sidebar-ring': 'oklch(0.439 0 0)',
            'chart-1': 'oklch(0.488 0.243 264.376)',
            'chart-2': 'oklch(0.696 0.17 162.48)',
            'chart-3': 'oklch(0.769 0.188 70.08)',
            'chart-4': 'oklch(0.627 0.265 303.9)',
            'chart-5': 'oklch(0.645 0.246 16.439)',
            'scrollbar-thumb': 'oklch(0.35 0 0)',
            'scrollbar-thumb-hover': 'oklch(0.48 0 0)',
            'scrollbar-track': 'oklch(0.20 0 0)',
        },
    },
    {
        id: 'euphoria',
        name: 'Euphoria',
        description: 'Identidade Vibbe — roxo elétrico e ciano neon',
        swatches: ['#5B6CFF', '#8B5CF6', '#00E1FF'],
        light: {
            background: 'oklch(0.97 0.008 285)',
            foreground: 'oklch(0.165 0.056 283)',
            card: 'oklch(1 0 0)',
            'card-foreground': 'oklch(0.165 0.056 283)',
            popover: 'oklch(1 0 0)',
            'popover-foreground': 'oklch(0.165 0.056 283)',
            primary: 'oklch(0.55 0.225 264)',
            'primary-foreground': 'oklch(1 0 0)',
            secondary: 'oklch(0.92 0.038 285)',
            'secondary-foreground': 'oklch(0.34 0.110 283)',
            muted: 'oklch(0.94 0.025 285)',
            'muted-foreground': 'oklch(0.52 0.088 287)',
            accent: 'oklch(0.855 0.157 200)',
            'accent-foreground': 'oklch(0.165 0.056 283)',
            destructive: 'oklch(0.577 0.245 27.325)',
            'destructive-foreground': 'oklch(1 0 0)',
            border: 'oklch(0.88 0.038 285)',
            input: 'oklch(0.88 0.038 285)',
            ring: 'oklch(0.55 0.225 264)',
            radius: '0.75rem',
            sidebar: 'oklch(0.94 0.025 285)',
            'sidebar-foreground': 'oklch(0.165 0.056 283)',
            'sidebar-primary': 'oklch(0.55 0.225 264)',
            'sidebar-primary-foreground': 'oklch(1 0 0)',
            'sidebar-accent': 'oklch(0.90 0.04 285)',
            'sidebar-accent-foreground': 'oklch(0.165 0.056 283)',
            'sidebar-border': 'oklch(0.88 0.038 285)',
            'sidebar-ring': 'oklch(0.55 0.225 264)',
            'chart-1': 'oklch(0.55 0.225 264)',
            'chart-2': 'oklch(0.585 0.222 292)',
            'chart-3': 'oklch(0.855 0.157 200)',
            'chart-4': 'oklch(0.725 0.153 295)',
            'chart-5': 'oklch(0.34 0.110 283)',
            'scrollbar-thumb': 'oklch(0.65 0.12 285)',
            'scrollbar-thumb-hover': 'oklch(0.55 0.18 264)',
            'scrollbar-track': 'oklch(0.92 0.038 285)',
        },
        dark: {
            background: 'oklch(0.155 0.05 285)',
            foreground: 'oklch(0.93 0.018 285)',
            card: 'oklch(0.20 0.055 285)',
            'card-foreground': 'oklch(0.93 0.018 285)',
            popover: 'oklch(0.20 0.055 285)',
            'popover-foreground': 'oklch(0.93 0.018 285)',
            primary: 'oklch(0.66 0.177 265)',
            'primary-foreground': 'oklch(0.155 0.05 285)',
            secondary: 'oklch(0.25 0.07 285)',
            'secondary-foreground': 'oklch(0.725 0.153 295)',
            muted: 'oklch(0.23 0.06 285)',
            'muted-foreground': 'oklch(0.57 0.088 287)',
            accent: 'oklch(0.855 0.157 200)',
            'accent-foreground': 'oklch(0.155 0.05 285)',
            destructive: 'oklch(0.55 0.22 27)',
            'destructive-foreground': 'oklch(0.985 0 0)',
            border: 'oklch(0.28 0.07 285)',
            input: 'oklch(0.28 0.07 285)',
            ring: 'oklch(0.66 0.177 265)',
            sidebar: 'oklch(0.13 0.05 285)',
            'sidebar-foreground': 'oklch(0.90 0.025 285)',
            'sidebar-primary': 'oklch(0.66 0.177 265)',
            'sidebar-primary-foreground': 'oklch(0.155 0.05 285)',
            'sidebar-accent': 'oklch(0.22 0.065 285)',
            'sidebar-accent-foreground': 'oklch(0.90 0.025 285)',
            'sidebar-border': 'oklch(0.22 0.065 285)',
            'sidebar-ring': 'oklch(0.66 0.177 265)',
            'chart-1': 'oklch(0.66 0.177 265)',
            'chart-2': 'oklch(0.585 0.222 292)',
            'chart-3': 'oklch(0.855 0.157 200)',
            'chart-4': 'oklch(0.725 0.153 295)',
            'chart-5': 'oklch(0.34 0.110 283)',
            'scrollbar-thumb': 'oklch(0.30 0.10 285)',
            'scrollbar-thumb-hover': 'oklch(0.42 0.16 265)',
            'scrollbar-track': 'oklch(0.20 0.055 285)',
        },
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyToDOM(tokens: Tokens, isDark: boolean): void {
    const el = document.documentElement;
    Object.entries(tokens.light).forEach(([k, v]) => el.style.setProperty(`--${k}`, v));
    Object.entries(tokens.dark).forEach(([k, v]) => {
        if (isDark) {
el.style.setProperty(`--${k}`, v);
}
    });
    Object.entries(tokens.themeVars).forEach(([k, v]) => el.style.setProperty(`--${k}`, v));

    if (isDark) {
        el.classList.add('dark');
    } else {
        el.classList.remove('dark');
    }
}

// ─── Sub-panels ──────────────────────────────────────────────────────────────

function ColorsEditor({
    tokens,
    mode,
    onColorChange,
}: {
    tokens: Tokens;
    mode: 'light' | 'dark';
    onColorChange: (key: string, hex: string) => void;
}) {
    const active = tokens[mode];

    return (
        <div className="space-y-6">
            {COLOR_GROUPS.map((group) => (
                <div key={group.label}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                        {group.label}
                    </p>
                    <div className="space-y-2">
                        {group.keys.map((key) => {
                            const value = active[key] ?? '';
                            const hex = isOklch(value) ? oklchToHex(value) : '#808080';

                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={hex}
                                        onChange={(e) => onColorChange(key, e.target.value)}
                                        className="size-7 rounded cursor-pointer border bg-transparent p-0.5 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-mono truncate">--{key}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono truncate">{value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ColorsPreview() {
    return (
        <div className="space-y-8">
            <section className="space-y-2">
                <p className="text-xs text-muted-foreground">Buttons</p>
                <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button disabled>Disabled</Button>
                </div>
            </section>
            <section className="space-y-2">
                <p className="text-xs text-muted-foreground">Badges</p>
                <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                </div>
            </section>
            <section className="space-y-2 max-w-sm">
                <p className="text-xs text-muted-foreground">Inputs</p>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <Label>Nome</Label>
                        <Input placeholder="Digite aqui…" />
                    </div>
                    <div className="space-y-1">
                        <Label>Desabilitado</Label>
                        <Input disabled placeholder="Desabilitado" />
                    </div>
                </div>
            </section>
            <section className="space-y-2 max-w-sm">
                <p className="text-xs text-muted-foreground">Card</p>
                <Card>
                    <CardHeader>
                        <CardTitle>Título do card</CardTitle>
                        <CardDescription>Descrição secundária do card.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button size="sm">Confirmar</Button>
                        <Button size="sm" variant="outline">Cancelar</Button>
                    </CardContent>
                </Card>
            </section>
            <section className="space-y-2">
                <p className="text-xs text-muted-foreground">Paleta</p>
                <div className="flex flex-wrap gap-3">
                    {['background', 'foreground', 'primary', 'secondary', 'muted', 'accent', 'destructive', 'border', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'].map((key) => (
                        <div key={key} className="text-center">
                            <div className="size-10 rounded border mb-1" style={{ background: `var(--${key})` }} />
                            <p className="text-[10px] text-muted-foreground">{key}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function TypographyEditor({
    tokens,
    onThemeVarChange,
}: {
    tokens: Tokens;
    onThemeVarChange: (key: string, value: string) => void;
}) {
    const fontValue = tokens.themeVars['font-sans'] ?? '';

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Font Family
                </Label>
                <Input
                    value={fontValue}
                    onChange={(e) => onThemeVarChange('font-sans', e.target.value)}
                    className="font-mono text-xs h-8"
                />
            </div>
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Presets</p>
                <div className="flex flex-wrap gap-2">
                    {FONT_PRESETS.map((preset) => (
                        <Button
                            key={preset.label}
                            size="sm"
                            variant={fontValue.startsWith(preset.value.split(',')[0]) ? 'default' : 'outline'}
                            onClick={() => onThemeVarChange('font-sans', preset.value)}
                        >
                            {preset.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TypographyPreview({ fontFamily }: { fontFamily: string }) {
    const style = { fontFamily };

    return (
        <div className="space-y-8" style={style}>
            <div>
                <p className="text-[80px] font-bold leading-none tracking-tight">Aa</p>
                <p className="text-sm text-muted-foreground font-mono mt-1 truncate">{fontFamily}</p>
            </div>
            <Separator />
            <div className="space-y-4">
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">H1 — 2.25rem / 700</p>
                    <p className="text-4xl font-bold">Vibbe Backstage</p>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">H2 — 1.875rem / 600</p>
                    <p className="text-3xl font-semibold">Gestão de identidade visual</p>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">H3 — 1.5rem / 600</p>
                    <p className="text-2xl font-semibold">Cores, tipografia e sombras</p>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Body — 1rem / 400</p>
                    <p className="text-base leading-relaxed">
                        O design system do Vibbe é composto por tokens que controlam cada aspecto visual da interface. Altere a fonte acima para ver o preview atualizar em tempo real.
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Small — 0.875rem / 400</p>
                    <p className="text-sm text-muted-foreground">
                        Texto auxiliar usado em labels, notas de rodapé e mensagens de validação.
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Mono — 0.875rem</p>
                    <p className="font-mono text-sm bg-muted px-3 py-2 rounded">const theme = oklch(0.205 0 0);</p>
                </div>
            </div>
        </div>
    );
}

function RadiusEditor({
    tokens,
    onRadiusChange,
}: {
    tokens: Tokens;
    onRadiusChange: (value: string) => void;
}) {
    const raw = tokens.light['radius'] ?? '0.625rem';
    const rem = parseFloat(raw) || 0;

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Base Radius
                    </Label>
                    <span className="text-sm font-mono font-semibold">{rem.toFixed(3)}rem</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.025}
                    value={rem}
                    onChange={(e) => onRadiusChange(`${parseFloat(e.target.value).toFixed(3)}rem`)}
                    className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0 — quadrado</span>
                    <span>0.5rem — padrão</span>
                    <span>1rem+</span>
                    <span>2rem — pill</span>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Derivados</p>
                <div className="space-y-2">
                    {[
                        { label: '--radius-sm', value: Math.max(0, rem - 0.25) },
                        { label: '--radius-md', value: Math.max(0, rem - 0.125) },
                        { label: '--radius-lg (base)', value: rem },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div
                                className="size-7 border bg-primary/20 shrink-0"
                                style={{ borderRadius: `${value}rem` }}
                            />
                            <p className="text-xs font-mono text-muted-foreground">{label}</p>
                            <p className="text-xs font-mono ml-auto">{value.toFixed(3)}rem</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RadiusPreview({ radius }: { radius: number }) {
    const sizes = [
        { label: 'none', value: 0 },
        { label: 'sm', value: Math.max(0, radius - 0.25) },
        { label: 'md', value: Math.max(0, radius - 0.125) },
        { label: 'lg (base)', value: radius },
        { label: 'xl', value: radius + 0.25 },
        { label: 'full', value: 9999 },
    ];

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs text-muted-foreground">Escala de arredondamento</p>
                <div className="flex flex-wrap gap-4">
                    {sizes.map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <div
                                className="size-14 bg-primary/15 border border-primary/30 mb-2"
                                style={{ borderRadius: `${value}rem` }}
                            />
                            <p className="text-[10px] text-muted-foreground">{label}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{value === 9999 ? '∞' : `${value.toFixed(2)}rem`}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Separator />

            <section className="space-y-3">
                <p className="text-xs text-muted-foreground">Componentes</p>
                <div className="space-y-3 max-w-xs">
                    <div className="flex gap-2 flex-wrap">
                        <Button style={{ borderRadius: `${radius}rem` }}>Botão padrão</Button>
                        <Button variant="outline" style={{ borderRadius: `${radius}rem` }}>Outline</Button>
                    </div>
                    <Input placeholder="Campo de texto" style={{ borderRadius: `${Math.max(0, radius - 0.125)}rem` }} />
                    <Badge style={{ borderRadius: `${Math.max(0, radius - 0.25)}rem` }}>Badge</Badge>
                    <Card style={{ borderRadius: `${radius}rem` }}>
                        <CardHeader>
                            <CardTitle>Card</CardTitle>
                            <CardDescription>Com o radius atual aplicado.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm" style={{ borderRadius: `${Math.max(0, radius - 0.125)}rem` }}>
                                Ação
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

function ShadowsEditor({
    tokens,
    onThemeVarChange,
}: {
    tokens: Tokens;
    onThemeVarChange: (key: string, value: string) => void;
}) {
    return (
        <div className="space-y-4">
            {SHADOW_KEYS.map(({ key, label }) => {
                const value = tokens.themeVars[key] ?? '';

                return (
                    <div key={key} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div
                                className="size-6 rounded bg-background border shrink-0"
                                style={{ boxShadow: value || 'none' }}
                            />
                            <Label className="text-xs font-mono">--{key}</Label>
                            <span className="text-[10px] text-muted-foreground ml-auto">{label}</span>
                        </div>
                        <Input
                            value={value}
                            onChange={(e) => onThemeVarChange(key, e.target.value)}
                            className="font-mono text-[11px] h-8"
                            placeholder="0 1px 2px 0 oklch(0 0 0 / 0.05)"
                        />
                    </div>
                );
            })}
        </div>
    );
}

function ShadowsPreview({ themeVars }: { themeVars: Record<string, string> }) {
    return (
        <div className="space-y-6">
            <p className="text-xs text-muted-foreground">Níveis de sombra</p>
            <div className="grid grid-cols-2 gap-6">
                {[
                    { key: 'shadow-sm', label: 'sm' },
                    { key: 'shadow', label: 'default' },
                    { key: 'shadow-md', label: 'md' },
                    { key: 'shadow-lg', label: 'lg' },
                    { key: 'shadow-xl', label: 'xl' },
                    { key: 'shadow-2xl', label: '2xl' },
                ].map(({ key, label }) => (
                    <div key={key} className="space-y-3">
                        <div
                            className="h-24 bg-card rounded-lg border flex items-center justify-center"
                            style={{ boxShadow: themeVars[key] ?? 'none' }}
                        >
                            <span className="text-xs font-mono text-muted-foreground">{label}</span>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground text-center truncate px-1">
                            {themeVars[key] ?? 'none'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Preset selector ─────────────────────────────────────────────────────────

function PresetSelector({ onApply }: { onApply: (light: Record<string, string>, dark: Record<string, string>) => void }) {
    return (
        <div className="px-5 py-3 border-b shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">Presets</p>
            <div className="flex gap-2 flex-wrap">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => onApply(preset.light, preset.dark)}
                        title={preset.description}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium hover:bg-muted transition-colors"
                    >
                        <div className="flex -space-x-1">
                            {preset.swatches.map((color, i) => (
                                <div
                                    key={i}
                                    className="size-3 rounded-full border border-background ring-1 ring-border"
                                    style={{ background: color }}
                                />
                            ))}
                        </div>
                        {preset.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Code tab ────────────────────────────────────────────────────────────────

function generateCss(tokens: Tokens): string {
    const block = (selector: string, vars: Record<string, string>) => {
        const lines = Object.entries(vars)
            .map(([k, v]) => `    --${k}: ${v};`)
            .join('\n');

        return `${selector} {\n${lines}\n}`;
    };

    const themeLines = Object.entries(tokens.themeVars)
        .map(([k, v]) => `    --${k}: ${v};`)
        .join('\n');

    return [
        block(':root', tokens.light),
        block('.dark', tokens.dark),
        `/* @theme (font e sombras) */\n${themeLines}`,
    ].join('\n\n');
}

function parseCssBlock(css: string, selector: string): Record<string, string> {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));

    if (!match?.[1]) {
return {};
}

    const result: Record<string, string> = {};
    const re = /--([^:]+):\s*([^;]+);/g;
    let m: RegExpExecArray | null;

    while ((m = re.exec(match[1])) !== null) {
        result[m[1].trim()] = m[2].trim();
    }

    return result;
}

function CodeTab({
    tokens,
    onApply,
}: {
    tokens: Tokens;
    onApply: (light: Record<string, string>, dark: Record<string, string>) => void;
}) {
    const generated = generateCss(tokens);
    const [importText, setImportText] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    function handleCopy(): void {
        navigator.clipboard.writeText(generated);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleApply(): void {
        const light = parseCssBlock(importText, ':root');
        const dark = parseCssBlock(importText, '.dark');

        if (Object.keys(light).length === 0 && Object.keys(dark).length === 0) {
            setError('Nenhum bloco :root ou .dark encontrado no CSS colado.');

            return;
        }

        setError('');
        onApply(light, dark);
        setImportText('');
    }

    return (
        <div className="space-y-5">
            {/* Output */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">CSS atual</p>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={handleCopy}>
                        {copied ? <Check className="size-3 mr-1" /> : <Copy className="size-3 mr-1" />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                </div>
                <textarea
                    readOnly
                    value={generated}
                    className="w-full h-56 font-mono text-[11px] leading-relaxed p-3 bg-muted rounded-md border resize-none focus:outline-none"
                />
            </div>

            <Separator />

            {/* Import */}
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Importar CSS</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Cole aqui um CSS com blocos <code className="font-mono bg-muted px-1 rounded">:root</code> e{' '}
                    <code className="font-mono bg-muted px-1 rounded">.dark</code> — por exemplo do{' '}
                    <span className="font-medium">shadcn/ui Themes</span>. Os tokens de cor serão preenchidos automaticamente.
                </p>
                <textarea
                    value={importText}
                    onChange={(e) => {
 setImportText(e.target.value); setError(''); 
}}
                    rows={8}
                    className="w-full font-mono text-[11px] leading-relaxed p-3 bg-background rounded-md border resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder={`:root {\n    --primary: oklch(...);\n    --background: oklch(...);\n    ...\n}\n\n.dark {\n    --primary: oklch(...);\n    ...\n}`}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Button size="sm" onClick={handleApply} disabled={!importText.trim()} className="w-full">
                    Aplicar CSS importado
                </Button>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThemeEditor({ light, dark, themeVars }: Props) {
    const { resolvedAppearance } = useAppearance();
    const [tab, setTab] = useState<TabId>('colors');
    const [mode, setMode] = useState<'light' | 'dark'>(resolvedAppearance);
    const [tokens, setTokens] = useState<Tokens>({ light, dark, themeVars });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        applyToDOM(tokens, mode === 'dark');
    }, [tokens, mode]);

    function setColor(key: string, hex: string): void {
        const oklch = hexToOklch(hex);
        setTokens((prev) => ({ ...prev, [mode]: { ...prev[mode], [key]: oklch } }));
    }

    function setThemeVar(key: string, value: string): void {
        setTokens((prev) => ({ ...prev, themeVars: { ...prev.themeVars, [key]: value } }));
    }

    function setRadius(value: string): void {
        setTokens((prev) => ({ ...prev, light: { ...prev.light, radius: value } }));
    }

    function handleApplyPreset(light: Record<string, string>, dark: Record<string, string>): void {
        setTokens((prev) => ({ ...prev, light: { ...light }, dark: { ...dark } }));
    }

    function handleApplyCss(light: Record<string, string>, dark: Record<string, string>): void {
        setTokens((prev) => ({
            ...prev,
            ...(Object.keys(light).length > 0 ? { light: { ...prev.light, ...light } } : {}),
            ...(Object.keys(dark).length > 0 ? { dark: { ...prev.dark, ...dark } } : {}),
        }));
    }

    function handleSave(): void {
        setSaving(true);
        router.post(
            dev.themeEditor.update.url(),
            { light: tokens.light, dark: tokens.dark, themeVars: tokens.themeVars },
            { onFinish: () => setSaving(false) },
        );
    }

    const radiusRem = parseFloat(tokens.light['radius'] ?? '0.625') || 0;
    const fontFamily = tokens.themeVars['font-sans'] ?? '';

    return (
        <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
            {/* Header */}
            <div className="border-b px-6 py-3 flex items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-base font-semibold">Theme Editor</h1>
                    <p className="text-xs text-muted-foreground">Local only — salva em resources/css/app.css</p>
                </div>
                <div className="flex items-center gap-2">
                    {tab === 'colors' && (
                        <>
                            <Button variant={mode === 'light' ? 'default' : 'outline'} size="sm" onClick={() => setMode('light')}>
                                <Sun className="size-3.5 mr-1" /> Light
                            </Button>
                            <Button variant={mode === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => setMode('dark')}>
                                <Moon className="size-3.5 mr-1" /> Dark
                            </Button>
                            <Separator orientation="vertical" className="h-5" />
                        </>
                    )}
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? 'Salvando…' : 'Save to app.css'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-[380px_1fr] flex-1 overflow-hidden">
                {/* Left — editor */}
                <div className="border-r flex flex-col overflow-hidden">
                    {/* Presets */}
                    <PresetSelector onApply={handleApplyPreset} />
                    {/* Tab bar */}
                    <div className="flex border-b shrink-0">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={cn(
                                    'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors border-b-2',
                                    tab === id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon className="size-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Editor content */}
                    <div className="overflow-y-auto p-5 flex-1">
                        {tab === 'colors' && (
                            <ColorsEditor tokens={tokens} mode={mode} onColorChange={setColor} />
                        )}
                        {tab === 'typography' && (
                            <TypographyEditor tokens={tokens} onThemeVarChange={setThemeVar} />
                        )}
                        {tab === 'radius' && (
                            <RadiusEditor tokens={tokens} onRadiusChange={setRadius} />
                        )}
                        {tab === 'shadows' && (
                            <ShadowsEditor tokens={tokens} onThemeVarChange={setThemeVar} />
                        )}
                        {tab === 'code' && (
                            <CodeTab tokens={tokens} onApply={handleApplyCss} />
                        )}
                    </div>
                </div>

                {/* Right — preview */}
                <div className="overflow-y-auto p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-6">
                        Preview
                    </p>
                    {tab === 'colors' && <ColorsPreview />}
                    {tab === 'typography' && <TypographyPreview fontFamily={fontFamily} />}
                    {tab === 'radius' && <RadiusPreview radius={radiusRem} />}
                    {tab === 'shadows' && <ShadowsPreview themeVars={tokens.themeVars} />}
                    {tab === 'code' && <ColorsPreview />}
                </div>
            </div>
        </div>
    );
}
