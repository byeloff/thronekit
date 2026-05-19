<?php

declare(strict_types=1);

namespace App\Support;

class PasswordPolicy
{
    /**
     * Returns the password policy as a serializable array for the frontend.
     *
     * @return array{min_length: int, require_mixed_case: bool, require_numbers: bool, require_symbols: bool}
     */
    public static function toArray(): array
    {
        return [
            'min_length' => (int) config('password.min_length'),
            'require_mixed_case' => (bool) config('password.require_mixed_case'),
            'require_numbers' => (bool) config('password.require_numbers'),
            'require_symbols' => (bool) config('password.require_symbols'),
        ];
    }
}
