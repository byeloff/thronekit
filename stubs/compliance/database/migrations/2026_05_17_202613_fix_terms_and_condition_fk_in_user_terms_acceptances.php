<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite não suporta drop/add FK por nome — a restrição é no-op nesse driver
        // (usado apenas em testes). Em produção usa PostgreSQL, onde é aplicada.
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('user_terms_acceptances', function (Blueprint $table) {
            // O rename da migration anterior renomeou a coluna mas a constraint
            // no banco manteve o nome original (terms_and_conditions_id_foreign).
            // Troca cascadeOnDelete → restrictOnDelete: registros de aceite são
            // evidência jurídica e não podem ser removidos se um T&C for excluído.
            $table->dropForeign('user_terms_acceptances_terms_and_conditions_id_foreign');
            $table->foreign('terms_and_condition_id')
                ->references('id')
                ->on('terms_and_conditions')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('user_terms_acceptances', function (Blueprint $table) {
            $table->dropForeign(['terms_and_condition_id']);
            $table->foreign('terms_and_condition_id')
                ->references('id')
                ->on('terms_and_conditions')
                ->cascadeOnDelete();
        });
    }
};
