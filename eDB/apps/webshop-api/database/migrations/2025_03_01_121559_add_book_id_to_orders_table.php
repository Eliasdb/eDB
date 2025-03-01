<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBookIdToOrdersTable extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Check if the column doesn't exist already
            if (!Schema::hasColumn('orders', 'book_id')) {
                $table->unsignedBigInteger('book_id')->after('user_id');
                $table->foreign('book_id')
                      ->references('id')
                      ->on('books')
                      ->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['book_id']);
            $table->dropColumn('book_id');
        });
    }
}
