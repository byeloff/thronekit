<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Support\FingerprintService;
use Illuminate\Console\Command;

class UnflagIpCommand extends Command
{
    protected $signature = 'fingerprint:unflag-ip {ip : Endereço IP a ser removido da lista de suspeitos}';

    protected $description = 'Remove um IP da lista de IPs suspeitos no Redis';

    public function handle(FingerprintService $fingerprint): int
    {
        $ip = (string) $this->argument('ip');

        if (! filter_var($ip, FILTER_VALIDATE_IP)) {
            $this->error("IP inválido: {$ip}");

            return self::FAILURE;
        }

        $fingerprint->unflagIp($ip);

        $this->info("IP {$ip} removido da lista de suspeitos.");

        return self::SUCCESS;
    }
}
