<p align="center">
  <img src="./assets/thronekit-banner.png" alt="ThroneKit" width="640">
</p>

<p align="center">
  <a href="https://packagist.org/packages/byeloff/thronekit"><img src="https://img.shields.io/packagist/v/byeloff/thronekit.svg" alt="Latest Version"></a>
  <a href="https://packagist.org/packages/byeloff/thronekit"><img src="https://img.shields.io/packagist/php-v/byeloff/thronekit.svg" alt="PHP Version"></a>
  <img src="https://img.shields.io/badge/Laravel-11%2B-FF2D20" alt="Laravel">
  <img src="https://img.shields.io/badge/React-19-61DAFB" alt="React">
  <a href="LICENSE"><img src="https://img.shields.io/packagist/l/byeloff/thronekit.svg" alt="License"></a>
</p>

---

**ThroneKit** is a Laravel + Inertia + React starter kit — batteries included. Drop it into a fresh Laravel app and get a production-ready full-stack foundation in one command.

- **Auth** — Fortify (login, register, 2FA, password reset, email verification)
- **Layout** — collapsible sidebar, dark mode, breadcrumbs, persistent Inertia layout
- **i18n** — three locales out of the box: `pt_BR`, `en`, `es`
- **UI** — Tailwind v4 + a full set of shadcn/ui components
- **Security** — Content Security Policy headers, role-based access via Spatie Permission

Optional modules let you add **LGPD/GDPR compliance** and **real-time WebSocket notifications** only when you need them.

---

## Requirements

| Dependency | Version |
|---|---|
| PHP | ≥ 8.2 |
| Laravel | ≥ 11 |
| Node.js | ≥ 20 |
| npm / pnpm / yarn | any recent |

---

## Installation

Start from a **fresh Laravel project**:

```bash
laravel new my-project
cd my-project

composer require byeloff/thronekit --dev
php artisan thronekit:install
```

The installer will ask which optional modules you want, then handle everything — file copying, Composer packages, npm packages, and migrations.

### Non-interactive install

```bash
# Core only
php artisan thronekit:install --modules=

# Core + all modules
php artisan thronekit:install --modules=compliance,notifications

# Skip npm / migrations (useful in CI)
php artisan thronekit:install --skip-npm --skip-migrate
```

---

## Modules

### Core *(always installed)*

Everything you need to start building immediately.

| What | Details |
|---|---|
| **Auth** | Fortify — login, register, 2FA (TOTP + recovery codes), password reset, email verification |
| **Layout** | Inertia persistent layout, collapsible icon sidebar, dark/light/system theme, breadcrumbs |
| **Localization** | `pt_BR` · `en` · `es` — `react-i18next` on the frontend, Laravel localization on the backend; locale persisted per user and cookie |
| **Security Headers** | CSP, X-Frame-Options, HSTS, Referrer-Policy middleware |
| **Roles** | `spatie/laravel-permission` — `superadmin` / `admin` pre-wired |
| **Admin: Users** | List users, assign / remove roles (superadmin only) |
| **UI** | Tailwind v4 + shadcn/ui components (Button, Card, Dialog, Sheet, Table, Sidebar, …) |
| **Misc** | Flash toast via Sonner, emoji-aware initials avatar, locale switcher, appearance toggle |

### Compliance *(optional)*

LGPD and GDPR requirements, fully wired.

```
composer require spatie/laravel-activitylog spatie/laravel-cookie-consent spatie/laravel-personal-data-export
php artisan thronekit:install --modules=compliance
```

| What | Details |
|---|---|
| **Cookie Consent** | Granular banner (essential / analytics / marketing), decision stored in a signed cookie, re-consent on version bump |
| **Terms & Conditions** | Versioned terms table, acceptance pivot with IP + user agent, middleware that blocks authenticated routes until accepted |
| **Data Export** | `/settings/privacy/export` triggers a queued ZIP export sent by email (`spatie/laravel-personal-data-export`) |
| **Right to Erasure** | `$user->anonymize()` via the `Anonymizable` trait — replaces PII, clears credentials, preserves audit log references |
| **Audit Trail** | `spatie/laravel-activitylog` — auth events (login, logout, failed, lockout, 2FA) auto-logged via `AuthActivitySubscriber` |
| **Privacy settings page** | `/settings/privacy` — export, anonymize, view accepted terms |

### Notifications *(optional)*

Real-time push notifications with an admin composer UI.

```
composer require laravel/reverb
php artisan thronekit:install --modules=notifications
```

| What | Details |
|---|---|
| **WebSocket** | Laravel Reverb + Echo — private channel per user (`App.Models.User.{id}`) |
| **Notification types** | `info`, `action` (yes / no), `link` |
| **Admin CRUD** | Create / edit in a side drawer, preview modal before send, draft or dispatch immediately |
| **Targeting** | All users · by role · specific users |
| **Bell dropdown** | Unread count badge, mark as read, handle action / link types |
| **Sound** | Web Audio API chime on arrival; toggle persisted in `localStorage` |
| **Emoji picker** | Body field with `emoji-mart` — cursor-aware insertion, dark mode, locale aware |

---

## What gets installed

```
app/
  Http/
    Controllers/      ← Auth, Settings, Admin (Users, Notifications), Compliance
    Middleware/        ← SecurityHeaders, HandleInertiaRequests, Localization, HandleAppearance
    Requests/          ← Form Requests per feature
    Resources/         ← Eloquent API Resources
  Jobs/                ← DispatchNotificationJob
  Listeners/           ← AuthActivitySubscriber
  Models/              ← User (+ Notification, NotificationRecipient, TermsAndCondition)
  Services/            ← LocaleResolver, CookieConsentState, NotificationService, TermsService
  Concerns/            ← Anonymizable trait

resources/js/
  app.tsx              ← Inertia + i18n bootstrap, persistent layout
  components/          ← AppSidebar, NavMain, LocaleSwitcher, NotificationBell, CookieConsent, …
  components/ui/       ← Full shadcn/ui library (32 components)
  hooks/               ← useAppearance, useNotifications, useNotificationSound, …
  layouts/             ← app-layout, auth-layout, settings-layout
  pages/               ← auth/*, dashboard, settings/*, admin/*, terms, privacy-policy

lang/
  pt_BR/ · en/ · es/  ← PHP and JSON translation files for all 3 locales
```

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.4, Inertia v3 |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind v4, shadcn/ui |
| Auth | Laravel Fortify |
| Roles | Spatie Laravel Permission |
| Async | Laravel Horizon (Redis) |
| WebSocket | Laravel Reverb + Echo |
| Search | Laravel Scout (`database` driver) |
| Testing | Pest 4 |

---

## License

MIT — see [LICENSE](LICENSE).
