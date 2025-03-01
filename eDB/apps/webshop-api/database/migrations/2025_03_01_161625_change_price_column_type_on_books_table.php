<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class ChangePriceColumnTypeOnBooksTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE books ALTER COLUMN price TYPE decimal(8,2) USING price::numeric(8,2)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to a string if needed. Adjust the type as necessary.
        DB::statement('ALTER TABLE books ALTER COLUMN price TYPE varchar(255) USING price::varchar');
    }
}
