<?php

declare(strict_types=1);

namespace App\Features;

use App\Models\User;

/**
 * Exemplo de feature class-based do Pennant.
 * Ativa o novo layout de dashboard para superadmins.
 *
 * Uso: Feature::active(NewDashboard::class)
 *      Feature::for($user)->active(NewDashboard::class)
 */
class NewDashboard
{
    public function resolve(User $user): bool
    {
        return $user->hasRole('superadmin');
    }
}
