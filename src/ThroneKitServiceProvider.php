<?php

declare(strict_types=1);

namespace ThroneKit;

use Illuminate\Support\ServiceProvider;
use ThroneKit\Console\Commands\InstallCommand;

class ThroneKitServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([InstallCommand::class]);
        }
    }
}
