<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class ChangeStockColumnTypeOnBooksTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE books ALTER COLUMN stock TYPE integer USING stock::integer');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert back to string (adjust the type as necessary)
        DB::statement('ALTER TABLE books ALTER COLUMN stock TYPE varchar(255) USING stock::varchar');
    }
}
