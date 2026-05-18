<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terms_and_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 64)->index();           // ex.: terms, privacy
            $table->string('version', 32);                  // ex.: 2026-05-17
            $table->string('locale', 8);                    // pt_BR, en, es
            $table->text('content');                        // markdown / HTML
            $table->timestampTz('published_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['slug', 'version', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terms_and_conditions');
    }
};
