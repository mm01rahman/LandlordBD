<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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

            $table->string('status'); // keep simple for Postgres portability
            // OR use enum-like check constraint via DB::statement (optional)

            $table->text('notes')->nullable();
            $table->timestamps();

            // Helpful index for lookups
            $table->index(['unit_id', 'status', 'end_date_actual']);
            $table->index(['tenant_id', 'status']);
            $table->index(['user_id', 'status']);
        });

        DB::statement("
            CREATE UNIQUE INDEX rental_agreements_one_active_per_unit
            ON rental_agreements (unit_id)
            WHERE status = 'active' AND end_date_actual IS NULL
        ");

        DB::statement("
            ALTER TABLE rental_agreements
            ADD CONSTRAINT rental_agreements_status_check
            CHECK (status IN ('active', 'ended', 'upcoming'))
        ");
    }

    public function down(): void
    {
        // Drop index/constraint safely (Postgres)
        DB::statement("DROP INDEX IF EXISTS rental_agreements_one_active_per_unit");
        DB::statement("ALTER TABLE rental_agreements DROP CONSTRAINT IF EXISTS rental_agreements_status_check");

        Schema::dropIfExists('rental_agreements');
    }
};