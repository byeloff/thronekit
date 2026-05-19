<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Data Protection Officer (DPO)
    |--------------------------------------------------------------------------
    |
    | Informações do Encarregado de Proteção de Dados (LGPD Art. 41 /
    | GDPR Art. 37). Preencher antes de ir para produção.
    |
    */

    'dpo' => [
        'name' => env('DPO_NAME', 'Maria Silva'),
        'title' => env('DPO_TITLE', 'Encarregada de Proteção de Dados'),
        'email' => env('DPO_EMAIL', 'dpo@vibbe.com.br'),
        'phone' => env('DPO_PHONE', '+55 11 3000-0000'),
        'address' => env('DPO_ADDRESS', 'Av. Paulista, 1000 — São Paulo / SP — CEP 01310-100'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Controller / Controladora
    |--------------------------------------------------------------------------
    |
    | Dados da empresa que trata os dados pessoais (controladora).
    |
    */

    'controller' => [
        'name' => env('COMPANY_NAME', 'Vibbe Tecnologia Ltda.'),
        'cnpj' => env('COMPANY_CNPJ', '00.000.000/0001-00'),
        'address' => env('COMPANY_ADDRESS', 'Av. Paulista, 1000 — São Paulo / SP — CEP 01310-100'),
        'email' => env('COMPANY_EMAIL', 'privacidade@vibbe.com.br'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Data Retention (dias)
    |--------------------------------------------------------------------------
    */

    'retention' => [
        'activity_log_days' => (int) env('PRIVACY_RETENTION_ACTIVITY_LOG', 365),
        'personal_export_days' => (int) env('PRIVACY_RETENTION_EXPORT', 5),
        'account_after_anonymization_years' => 5,
    ],

];
