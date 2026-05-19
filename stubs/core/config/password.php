<?php

return [
    'min_length' => (int) env('PASSWORD_MIN_LENGTH', 12),
    'require_mixed_case' => (bool) env('PASSWORD_REQUIRE_MIXED_CASE', true),
    'require_numbers' => (bool) env('PASSWORD_REQUIRE_NUMBERS', true),
    'require_symbols' => (bool) env('PASSWORD_REQUIRE_SYMBOLS', true),

    // Verifica a senha contra o Have I Been Pwned — requer acesso à internet.
    // Desative em ambientes de desenvolvimento/CI sem saída para a internet.
    'uncompromised' => (bool) env('PASSWORD_UNCOMPROMISED', false),
];
