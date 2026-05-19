<?php

declare(strict_types=1);

namespace App\Enums;

enum NotificationTarget: string
{
    case All = 'all';
    case Role = 'role';
    case Specific = 'specific';
}
