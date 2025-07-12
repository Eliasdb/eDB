<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    public function up(): void
    {
        /* ──────────────────────────────────────────────
         | 1.  Drop the current foreign key constraint   |
         ────────────────────────────────────────────── */
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);      // order_items_order_id_foreign
        });

        /* ──────────────────────────────────────────────
         | 2.  Re-create orders with UUID PK + columns   |
         ────────────────────────────────────────────── */
        Schema::dropIfExists('orders');

        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')
                  ->primary()
                  ->default(DB::raw('uuid_generate_v4()'));

            $table->string('user_id');               // Keycloak sub
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'paid', 'shipped', 'cancelled'])
                  ->default('pending');
            $table->timestamps();
        });

        /* ──────────────────────────────────────────────
         | 3.  Clean order_items (remove orphans)        |
         ────────────────────────────────────────────── */
        // Fastest: wipe the table entirely.  Comment this out if you need the rows.
        DB::table('order_items')->truncate();

        /* Instead of truncating you could keep valid rows:
           DB::statement('DELETE FROM order_items WHERE order_id NOT IN (SELECT id FROM orders)');
        */

        /* ──────────────────────────────────────────────
         | 4.  Convert order_id column to UUID           |
         |     (requires doctrine/dbal for ->change())   |
         ────────────────────────────────────────────── */
        DB::statement('ALTER TABLE order_items ALTER COLUMN order_id TYPE uuid USING order_id::uuid');

        /* ──────────────────────────────────────────────
         | 5.  Re-add FK with cascade delete             |
         ────────────────────────────────────────────── */
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('order_id')
                  ->references('id')->on('orders')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        // 1) Drop the FK again …
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        // 2) … and drop the orders table.
        Schema::dropIfExists('orders');
    }
};
