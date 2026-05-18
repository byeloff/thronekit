<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Locales suportados
    |--------------------------------------------------------------------------
    |
    | Lista canônica de locales que o app aceita. A ordem de listagem é a
    | ordem que aparece em UI (LocaleSwitcher). O default vem de config/app.php
    | (APP_LOCALE no .env).
    |
    */

    'available' => ['pt_BR', 'en', 'es'],

    /*
    |--------------------------------------------------------------------------
    | Metadados pra UI
    |--------------------------------------------------------------------------
    |
    | Exposto via Inertia (`availableLocales` shared prop). Permite o frontend
    | renderizar nomes nativos sem hardcoded.
    |
    */

    'display' => [
        'pt_BR' => ['label' => 'Português', 'native' => 'Português (Brasil)', 'flag' => '🇧🇷'],
        'en' => ['label' => 'English',    'native' => 'English',           'flag' => '🇺🇸'],
        'es' => ['label' => 'Español',    'native' => 'Español',           'flag' => '🇪🇸'],
    ],

];
