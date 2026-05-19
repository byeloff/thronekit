<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->string('type'); // info | action | link
            $table->jsonb('data')->nullable(); // action: {yes_label,no_label}; link: {url,label}
            $table->string('target_type'); // all | role | specific
            $table->jsonb('target_roles')->nullable();
            $table->jsonb('target_user_ids')->nullable();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('dispatched_at')->nullable();
            $table->timestamps();

            $table->index('dispatched_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
