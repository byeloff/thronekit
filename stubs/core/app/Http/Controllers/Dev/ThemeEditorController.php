<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dev;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ThemeEditorController extends Controller
{
    /** Vars do @theme que o editor expõe (restante é derivado e não deve ser editado manualmente). */
    private const EDITABLE_THEME_KEYS = [
        'font-sans',
        'shadow-sm',
        'shadow',
        'shadow-md',
        'shadow-lg',
        'shadow-xl',
        'shadow-2xl',
    ];

    public function index(): Response
    {
        $css = (string) file_get_contents(resource_path('css/app.css'));

        return Inertia::render('dev/theme-editor', [
            'light' => $this->parseBlock(':root', $css),
            'dark' => $this->parseBlock('.dark', $css),
            'themeVars' => $this->parseThemeVars($css),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'light' => ['required', 'array'],
            'dark' => ['required', 'array'],
            'themeVars' => ['required', 'array'],
        ]);

        /** @var array<string, string> $light */
        $light = $request->input('light');

        /** @var array<string, string> $dark */
        $dark = $request->input('dark');

        /** @var array<string, string> $themeVars */
        $themeVars = $request->input('themeVars');

        $css = (string) file_get_contents(resource_path('css/app.css'));
        $css = $this->replaceBlock(':root', $css, $light);
        $css = $this->replaceBlock('.dark', $css, $dark);
        $css = $this->writeThemeVars($css, $themeVars);

        file_put_contents(resource_path('css/app.css'), $css);

        return back()->with('success', 'Tema salvo com sucesso.');
    }

    /** @return array<string, string> */
    private function parseBlock(string $selector, string $css): array
    {
        preg_match('/'.preg_quote($selector, '/').' *\{([^}]+)\}/', $css, $matches);
        $block = $matches[1] ?? '';

        preg_match_all('/--([^:]+):\s*([^;]+);/', $block, $vars, PREG_SET_ORDER);

        $result = [];
        foreach ($vars as $var) {
            $result[trim((string) $var[1])] = trim((string) $var[2]);
        }

        return $result;
    }

    /** @return array<string, string> */
    private function parseThemeVars(string $css): array
    {
        $all = $this->parseBlock('@theme', $css);

        $result = [];
        foreach (self::EDITABLE_THEME_KEYS as $key) {
            if (isset($all[$key])) {
                // Normaliza whitespace interno (font-sans é multiline no CSS)
                $result[$key] = (string) preg_replace('/\s+/', ' ', $all[$key]);
            }
        }

        return $result;
    }

    /** @param  array<string, string>  $tokens */
    private function replaceBlock(string $selector, string $css, array $tokens): string
    {
        $lines = collect($tokens)
            ->map(fn (string $value, string $key) => "    --{$key}: {$value};")
            ->implode("\n");

        $replacement = "{$selector} {\n{$lines}\n}";

        return (string) preg_replace(
            '/'.preg_quote($selector, '/').' *\{[^}]+\}/',
            $replacement,
            $css,
        );
    }

    /** @param  array<string, string>  $themeVars */
    private function writeThemeVars(string $css, array $themeVars): string
    {
        foreach (self::EDITABLE_THEME_KEYS as $key) {
            if (! isset($themeVars[$key])) {
                continue;
            }

            $value = $themeVars[$key];
            // Substitui o var específico preservando o restante do bloco @theme
            $css = (string) preg_replace(
                '/--'.preg_quote($key, '/').':\s*[^;]*;/',
                "--{$key}: {$value};",
                $css,
            );
        }

        return $css;
    }
}
