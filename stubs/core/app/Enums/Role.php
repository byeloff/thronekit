<?php

declare(strict_types=1);

namespace App\Enums;

enum Role: string
{
    case SuperAdmin = 'superadmin';
    case Admin = 'admin';
    case B2b = 'b2b';
    case B2c = 'b2c';
}
