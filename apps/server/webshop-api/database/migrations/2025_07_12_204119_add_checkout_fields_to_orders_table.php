<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            /* ───────────  A) rename total_price → amount  ───────────
               Requires doctrine/dbal in dev:
               composer require --dev doctrine/dbal
            */
            if (Schema::hasColumn('orders', 'total_price') &&
                ! Schema::hasColumn('orders', 'amount')) {
                $table->renameColumn('total_price', 'amount');
            }

            /* ───────────  B) add the missing columns  ─────────── */
            if (! Schema::hasColumn('orders', 'order_date')) {
                $table->timestamp('order_date')
                      ->nullable()
                      ->after('status');
            }

            if (! Schema::hasColumn('orders', 'full_name')) {
                $table->string('full_name')->after('order_date');
            }
            if (! Schema::hasColumn('orders', 'address')) {
                $table->string('address')->after('full_name');
            }
            if (! Schema::hasColumn('orders', 'city')) {
                $table->string('city')->after('address');
            }
            if (! Schema::hasColumn('orders', 'postal_code')) {
                $table->string('postal_code')->after('city');
            }
            if (! Schema::hasColumn('orders', 'email')) {
                $table->string('email')->after('postal_code');
            }
        });

        /* Optional: back-fill order_date with created_at if null */
        DB::statement("
            UPDATE orders
            SET order_date = created_at
            WHERE order_date IS NULL
        ");
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_date',
                'full_name',
                'address',
                'city',
                'postal_code',
                'email',
            ]);

            // Rename amount → total_price back (requires doctrine/dbal).
            if (Schema::hasColumn('orders', 'amount') &&
                ! Schema::hasColumn('orders', 'total_price')) {
                $table->renameColumn('amount', 'total_price');
            }
        });
    }
};
