<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Support\FingerprintService;
use Illuminate\Console\Command;

class FlagIpCommand extends Command
{
    protected $signature = 'fingerprint:flag-ip {ip : Endereço IP a ser flagrado} {--ttl=86400 : TTL em segundos (padrão 24h)}';

    protected $description = 'Adiciona um IP à lista de IPs suspeitos no Redis';

    public function handle(FingerprintService $fingerprint): int
    {
        $ip = (string) $this->argument('ip');
        $ttl = (int) $this->option('ttl');

        if (! filter_var($ip, FILTER_VALIDATE_IP)) {
            $this->error("IP inválido: {$ip}");

            return self::FAILURE;
        }

        $fingerprint->flagIp($ip, $ttl);

        $this->info("IP {$ip} flagrado por {$ttl}s.");

        return self::SUCCESS;
    }
}
