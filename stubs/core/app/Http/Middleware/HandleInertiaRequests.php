<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\NotificationRecipient;
use App\Services\Support\CookieConsentState;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = App::getLocale();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user()?->getRoleNames() ?? [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'cookieConsent' => CookieConsentState::fromRequest($request),
            'locale' => $locale,
            'availableLocales' => $this->availableLocalesPayload(),
            'translations' => $this->loadTranslations($locale),
            'isLocal' => App::isLocal(),
            'unreadNotificationCount' => Inertia::optional(
                fn () => $request->user()
                    ? NotificationRecipient::where('user_id', $request->user()->id)->whereNull('read_at')->count()
                    : 0
            ),
        ];
    }

    /**
     * Bundle JSON de traduções do locale ativo para o frontend (react-i18next).
     *
     * @return array<string, mixed>
     */
    private function loadTranslations(string $locale): array
    {
        $path = base_path("lang/frontend/{$locale}.json");
        if (! is_file($path)) {
            return [];
        }

        $contents = file_get_contents($path);
        if ($contents === false) {
            return [];
        }

        $decoded = json_decode($contents, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @return list<array{code: string, label: string, native: string, flag: string}>
     */
    private function availableLocalesPayload(): array
    {
        /** @var list<string> $available */
        $available = config('locales.available', []);
        /** @var array<string, array{label: string, native: string, flag: string}> $display */
        $display = config('locales.display', []);

        return array_map(
            fn (string $code): array => [
                'code' => $code,
                'label' => $display[$code]['label'] ?? $code,
                'native' => $display[$code]['native'] ?? $code,
                'flag' => $display[$code]['flag'] ?? '',
            ],
            $available,
        );
    }
}
