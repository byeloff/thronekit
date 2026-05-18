<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_terms_acceptances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('terms_and_condition_id')
                ->constrained('terms_and_conditions')
                ->cascadeOnDelete();
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestampTz('accepted_at')->useCurrent()->index();
            $table->timestamps();

            // Um user só aceita uma vez cada versão (mesmo se reverter).
            $table->unique(['user_id', 'terms_and_condition_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_terms_acceptances');
    }
};
