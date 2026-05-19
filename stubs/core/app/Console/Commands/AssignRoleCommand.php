<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\select;
use function Laravel\Prompts\suggest;

class AssignRoleCommand extends Command
{
    protected $signature = 'user:assign-role
                            {user? : E-mail ou ID do usuário}
                            {role? : Nome da role (superadmin, admin, b2b, b2c)}
                            {--revoke : Revoga a role em vez de atribuir}';

    protected $description = 'Atribui (ou revoga) uma role a um usuário';

    public function handle(): int
    {
        $userInput = $this->argument('user')
            ?? suggest(
                label: 'E-mail ou ID do usuário',
                options: fn (string $value) => User::query()
                    ->where('email', 'like', "%{$value}%")
                    ->orWhere('id', $value)
                    ->limit(10)
                    ->pluck('email')
                    ->toArray(),
                placeholder: 'usuario@example.com',
                required: true,
            );

        $user = is_numeric($userInput)
            ? User::find((int) $userInput)
            : User::where('email', $userInput)->first();

        if ($user === null) {
            $this->error("Usuário \"{$userInput}\" não encontrado.");

            return self::FAILURE;
        }

        $roleNames = array_column(Role::cases(), 'value');

        $roleInput = $this->argument('role')
            ?? select(
                label: 'Role',
                options: $roleNames,
                default: $user->getRoleNames()->first() ?? $roleNames[0],
            );

        if (! in_array($roleInput, $roleNames, true)) {
            $this->error("Role \"{$roleInput}\" inválida. Válidas: ".implode(', ', $roleNames));

            return self::FAILURE;
        }

        $revoking = (bool) $this->option('revoke');

        if ($revoking) {
            $user->removeRole($roleInput);
            $this->info("Role \"{$roleInput}\" revogada de {$user->email}.");
        } else {
            $user->assignRole($roleInput);
            $this->info("Role \"{$roleInput}\" atribuída a {$user->email}.");
        }

        $this->line('Roles atuais: '.$user->fresh()->getRoleNames()->implode(', '));

        return self::SUCCESS;
    }
}
