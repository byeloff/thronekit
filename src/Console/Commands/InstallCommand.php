<?php

declare(strict_types=1);

namespace ThroneKit\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Process;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\info;
use function Laravel\Prompts\multiselect;
use function Laravel\Prompts\note;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\warning;

class InstallCommand extends Command
{
    protected $signature = 'thronekit:install
                            {--modules= : Comma-separated list of modules to install (compliance,notifications,fingerprint)}
                            {--skip-npm : Skip npm package installation}
                            {--skip-migrate : Skip database migrations}';

    protected $description = 'Install ThroneKit starter kit into a fresh Laravel application';

    public function handle(Filesystem $files): int
    {
        info('');
        info('  🏰 ThroneKit Starter Kit');
        info('  ────────────────────────────────────────────');
        info('');

        // ── Core (always installed) ───────────────────────────────────────────
        note('Installing core (Auth + Layout + i18n + Security Headers)...');
        $this->installCore($files);
        $this->line('  ✓ Core installed');
        $this->line('');

        // ── Optional modules ─────────────────────────────────────────────────
        $selectedModules = $this->resolveModules();

        if (in_array('compliance', $selectedModules, true)) {
            note('Installing Compliance module (LGPD/GDPR)...');
            $this->installCompliance($files);
            $this->line('  ✓ Compliance installed');
            $this->line('');
        }

        if (in_array('notifications', $selectedModules, true)) {
            note('Installing Notifications module (WebSocket + Admin CRUD)...');
            $this->installNotifications($files);
            $this->line('  ✓ Notifications installed');
            $this->line('');
        }

        if (in_array('fingerprint', $selectedModules, true)) {
            note('Installing Fingerprint module (trust scoring + bot protection)...');
            $this->installFingerprint($files);
            $this->line('  ✓ Fingerprint installed');
            $this->line('');
        }

        // ── NPM deps ─────────────────────────────────────────────────────────
        if (! $this->option('skip-npm')) {
            $this->installNpmDeps($selectedModules);
        }

        // ── Composer deps for optional modules ───────────────────────────────
        $this->installComposerDeps($selectedModules);

        // ── Migrations ───────────────────────────────────────────────────────
        if (! $this->option('skip-migrate')) {
            if (confirm('Run database migrations now?', true)) {
                $this->call('migrate');
            }
        }

        // ── Post-install summary ─────────────────────────────────────────────
        info('');
        info('  ✅ ThroneKit installed successfully!');
        info('');
        $this->line('  Next steps:');
        $this->line('  1. Configure your <fg=cyan>.env</> (DB, MAIL, REVERB_*)');

        if (in_array('notifications', $selectedModules, true)) {
            $this->line('  2. Start Reverb: <fg=cyan>php artisan reverb:start</>');
        }

        $this->line('  ' . (in_array('notifications', $selectedModules, true) ? '3' : '2') . '. Run dev server: <fg=cyan>composer run dev</>');
        $this->line('');

        return self::SUCCESS;
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Module resolution                                                       */
    /* ──────────────────────────────────────────────────────────────────────── */

    /** @return list<string> */
    private function resolveModules(): array
    {
        if ($this->option('modules') !== null) {
            return array_filter(
                array_map('trim', explode(',', (string) $this->option('modules')))
            );
        }

        return multiselect(
            label: 'Which optional modules would you like to install?',
            options: [
                'compliance'    => '🔒 Compliance    — LGPD/GDPR: cookie consent, terms, data export & anonymization',
                'notifications' => '🔔 Notifications  — WebSocket real-time + admin CRUD + emoji composer',
                'fingerprint'   => '🛡️  Fingerprint   — Trust scoring + bot protection + rate limiting',
            ],
            hint: 'Space to select, Enter to confirm. You can always add modules later.',
        );
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Core installation                                                       */
    /* ──────────────────────────────────────────────────────────────────────── */

    private function installCore(Filesystem $files): void
    {
        $stubs = $this->stubsPath('core');

        // PHP
        $this->copyStubTree($files, $stubs . '/app',      base_path('app'));
        $this->copyStubTree($files, $stubs . '/bootstrap', base_path('bootstrap'));
        $this->copyStubTree($files, $stubs . '/config',   base_path('config'));
        $this->copyStubTree($files, $stubs . '/database', base_path('database'));
        $this->copyStubTree($files, $stubs . '/lang',     base_path('lang'));
        $this->copyStubTree($files, $stubs . '/routes',   base_path('routes'));

        // Frontend
        $this->copyStubTree($files, $stubs . '/resources', base_path('resources'));

        // Config files at root
        foreach (['vite.config.ts', 'tsconfig.json', 'eslint.config.js', '.prettierrc', 'package.json'] as $file) {
            $src = $stubs . '/' . $file;

            if ($files->exists($src)) {
                $files->copy($src, base_path($file));
            }
        }
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Compliance module                                                        */
    /* ──────────────────────────────────────────────────────────────────────── */

    private function installCompliance(Filesystem $files): void
    {
        $stubs = $this->stubsPath('compliance');

        $this->copyStubTree($files, $stubs . '/app',      base_path('app'));
        $this->copyStubTree($files, $stubs . '/database', base_path('database'));
        $this->copyStubTree($files, $stubs . '/lang',     base_path('lang'));
        $this->copyStubTree($files, $stubs . '/resources', base_path('resources'));

        // Merge compliance routes into routes/web.php
        $this->appendToFile(
            base_path('routes/web.php'),
            $files->get($stubs . '/routes-append.php'),
        );

        // Add terms.accepted middleware alias to bootstrap/app.php
        $this->patchBootstrapApp(
            "'terms.accepted' => \\App\\Http\\Middleware\\EnsureTermsAccepted::class,",
            '// [thronekit:compliance-middleware]',
        );
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Notifications module                                                     */
    /* ──────────────────────────────────────────────────────────────────────── */

    private function installNotifications(Filesystem $files): void
    {
        $stubs = $this->stubsPath('notifications');

        $this->copyStubTree($files, $stubs . '/app',      base_path('app'));
        $this->copyStubTree($files, $stubs . '/database', base_path('database'));
        $this->copyStubTree($files, $stubs . '/lang',     base_path('lang'));
        $this->copyStubTree($files, $stubs . '/resources', base_path('resources'));

        // Merge notification routes into routes/web.php
        $this->appendToFile(
            base_path('routes/web.php'),
            $files->get($stubs . '/routes-append.php'),
        );
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Fingerprint module                                                       */
    /* ──────────────────────────────────────────────────────────────────────── */

    private function installFingerprint(Filesystem $files): void
    {
        $stubs = $this->stubsPath('fingerprint');

        $this->copyStubTree($files, $stubs . '/app',       base_path('app'));
        $this->copyStubTree($files, $stubs . '/resources', base_path('resources'));
        $this->copyStubTree($files, $stubs . '/tests',     base_path('tests'));

        // Alias no bootstrap/app.php
        $this->patchBootstrapApp(
            "'fingerprint' => \\App\\Http\\Middleware\\FingerprintMiddleware::class,",
            '// [thronekit:fingerprint-middleware]',
        );

        // Import em resources/js/app.tsx
        $this->patchTextFile(
            base_path('resources/js/app.tsx'),
            "// [thronekit:fingerprint-import]\n",
            "import { initFingerprint } from '@/fingerprint';\n",
        );

        // Chamada de inicialização em resources/js/app.tsx
        $this->patchTextFile(
            base_path('resources/js/app.tsx'),
            '    // [thronekit:fingerprint-init]',
            '    initFingerprint();',
        );

        // Singleton no AppServiceProvider::register()
        $this->patchTextFile(
            base_path('app/Providers/AppServiceProvider.php'),
            '        // [thronekit:fingerprint-singleton]',
            '        $this->app->singleton(\App\Services\Support\FingerprintService::class);',
        );

        // Rate limiter no AppServiceProvider::configureRateLimiters()
        $limiterCode = <<<'PHP'
        // Rotas sensíveis com fingerprint: 60 req/min em prod, 300 em local/testing.
        RateLimiter::for('fingerprinted', function (Request $request): Limit {
            $key = (string) ($request->attributes->get('fingerprint_key') ?? $request->ip());
            $limit = app()->isProduction() ? 60 : 300;

            return Limit::perMinute($limit)->by($key.'|'.$request->ip());
        });

        // [thronekit:fingerprint-limiter]
PHP;

        $this->patchTextFile(
            base_path('app/Providers/AppServiceProvider.php'),
            '        // [thronekit:fingerprint-limiter]',
            $limiterCode,
        );
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Dependency management                                                    */
    /* ──────────────────────────────────────────────────────────────────────── */

    /** @param list<string> $modules */
    private function installNpmDeps(array $modules): void
    {
        $packages = [
            '@inertiajs/react',
            'react',
            'react-dom',
            'react-i18next',
            'i18next',
            'laravel-echo',
            '@tailwindcss/vite',
            'tailwindcss',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'sonner',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            '@radix-ui/react-separator',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-label',
        ];

        if (in_array('notifications', $modules, true)) {
            $packages[] = 'pusher-js';
            $packages[] = '@emoji-mart/react';
            $packages[] = '@emoji-mart/data';
            $packages[] = '@radix-ui/react-popover';
            $packages[] = '@radix-ui/react-radio-group';
            $packages[] = '@radix-ui/react-checkbox';
            $packages[] = '@radix-ui/react-scroll-area';
        }

        if (in_array('fingerprint', $modules, true)) {
            $packages[] = '@fingerprintjs/fingerprintjs';
        }

        $manager = $this->detectNodePackageManager();

        spin(
            fn () => Process::run(sprintf('%s add %s', $manager, implode(' ', $packages)))
                ->throw(),
            'Installing npm packages...',
        );

        $this->line("  ✓ npm packages installed via {$manager}");
    }

    /** @param list<string> $modules */
    private function installComposerDeps(array $modules): void
    {
        $packages = [];

        if (in_array('compliance', $modules, true)) {
            $packages[] = 'spatie/laravel-activitylog';
            $packages[] = 'spatie/laravel-cookie-consent';
            $packages[] = 'spatie/laravel-personal-data-export';
        }

        if (in_array('notifications', $modules, true)) {
            $packages[] = 'laravel/reverb';
        }

        if ($packages === []) {
            return;
        }

        if (confirm(sprintf('Install required Composer packages? (%s)', implode(', ', $packages)), true)) {
            spin(
                fn () => Process::run(sprintf('composer require %s', implode(' ', $packages)))
                    ->throw(),
                'Installing Composer packages...',
            );

            $this->line('  ✓ Composer packages installed');
        } else {
            warning('Skipped Composer packages — install them manually before using the selected modules.');
        }
    }

    /* ──────────────────────────────────────────────────────────────────────── */
    /*  Helpers                                                                  */
    /* ──────────────────────────────────────────────────────────────────────── */

    private function copyStubTree(Filesystem $files, string $src, string $dest): void
    {
        if (! $files->isDirectory($src)) {
            return;
        }

        $files->ensureDirectoryExists($dest);

        foreach ($files->allFiles($src) as $file) {
            $relativePath = $file->getRelativePathname();
            $targetPath   = $dest . DIRECTORY_SEPARATOR . $relativePath;

            $files->ensureDirectoryExists(dirname($targetPath));
            $files->copy($file->getPathname(), $targetPath);
        }
    }

    private function appendToFile(string $path, string $content): void
    {
        file_put_contents($path, PHP_EOL . $content, FILE_APPEND);
    }

    private function patchTextFile(string $path, string $anchor, string $replacement): void
    {
        $content = file_get_contents($path);

        if (! str_contains($content, $anchor)) {
            return;
        }

        file_put_contents($path, str_replace($anchor, $replacement, $content));
    }

    private function patchBootstrapApp(string $line, string $anchor): void
    {
        $path    = base_path('bootstrap/app.php');
        $content = file_get_contents($path);

        if (str_contains($content, $line)) {
            return;
        }

        file_put_contents($path, str_replace($anchor, $anchor . PHP_EOL . '            ' . $line, $content));
    }

    private function stubsPath(string $module): string
    {
        return dirname(__DIR__, 3) . '/stubs/' . $module;
    }

    private function detectNodePackageManager(): string
    {
        if (file_exists(base_path('pnpm-lock.yaml'))) {
            return 'pnpm';
        }

        if (file_exists(base_path('yarn.lock'))) {
            return 'yarn';
        }

        return 'npm';
    }
}
