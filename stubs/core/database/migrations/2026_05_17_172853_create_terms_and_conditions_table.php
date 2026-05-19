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
            $table->string('slug', 64)->index();
            $table->string('version', 32);
            $table->string('locale', 8);
            $table->text('content');
            $table->timestampTz('published_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['slug', 'version', 'locale']);
        });

        Schema::create('user_terms_acceptances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('terms_and_condition_id')
                ->constrained('terms_and_conditions')
                ->cascadeOnDelete();
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('fingerprint_key', 64)->nullable();
            $table->timestampTz('accepted_at')->useCurrent()->index();
            $table->timestamps();

            $table->unique(['user_id', 'terms_and_condition_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_terms_acceptances');
        Schema::dropIfExists('terms_and_conditions');
    }
};
