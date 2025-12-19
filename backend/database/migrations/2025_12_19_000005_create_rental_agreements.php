<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public $withinTransaction = false;
    
    public function up(): void
    {
        Schema::create('rental_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('end_date_actual')->nullable();
            $table->decimal('monthly_rent', 10, 2);
            $table->decimal('security_deposit', 10, 2)->default(0);
            $table->enum('status', ['active', 'ended', 'upcoming']);
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('active_unit')->nullable()->virtualAs("case when status = 'active' and end_date_actual IS NULL then unit_id end");
            $table->timestamps();

            $table->unique('active_unit');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_agreements');
    }
};
