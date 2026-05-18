<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Spatie\Health\Commands\DispatchQueueCheckJobsCommand;
use Spatie\Health\Commands\RunHealthChecksCommand;
use Spatie\Health\Commands\ScheduleCheckHeartbeatCommand;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Executa todos os health checks a cada minuto e persiste o resultado.
Schedule::command(RunHealthChecksCommand::class)->everyMinute();

// Despacha o HealthQueueJob para o Horizon — confirma que workers estão respondendo.
Schedule::command(DispatchQueueCheckJobsCommand::class)->everyMinute();

// Pulsa o heartbeat do ScheduleCheck — confirma que o scheduler está rodando.
Schedule::command(ScheduleCheckHeartbeatCommand::class)->everyMinute();

// ─── Retenção de dados (LGPD Art. 16 / GDPR Art. 5(1)(e)) ───────────────────

// Remove activity_log com mais de 365 dias (config activitylog.clean_after_days).
Schedule::command('activitylog:clean')->dailyAt('02:00');

// Remove ZIPs de exportação de dados pessoais expirados (config delete_after_days).
Schedule::command('personal-data-export:clean')->dailyAt('02:15');

// Limpa jobs em batch e filas failed com mais de 30 dias.
Schedule::command('queue:prune-batches', ['--hours' => 720])->dailyAt('02:30');
Schedule::command('queue:prune-failed', ['--hours' => 720])->dailyAt('02:30');
