<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Alinha o nome da coluna FK com a convenção do Eloquent:
     * `App\Models\TermsAndCondition` → `terms_and_condition_id` (singular).
     * Antes estava `terms_and_conditions_id` (plural, derivada do nome da
     * tabela), o que quebrava o relacionamento belongsToMany por inferência
     * automática.
     */
    public function up(): void
    {
        // Idempotente: em ambientes novos (fresh migrate) a create migration
        // já cria com o nome correto. Aqui só rodamos o rename se a coluna
        // antiga ainda existir (ambientes que rodaram a versão original).
        if (! Schema::hasColumn('user_terms_acceptances', 'terms_and_conditions_id')) {
            return;
        }

        Schema::table('user_terms_acceptances', function (Blueprint $table) {
            $table->renameColumn('terms_and_conditions_id', 'terms_and_condition_id');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('user_terms_acceptances', 'terms_and_condition_id')) {
            return;
        }

        Schema::table('user_terms_acceptances', function (Blueprint $table) {
            $table->renameColumn('terms_and_condition_id', 'terms_and_conditions_id');
        });
    }
};
