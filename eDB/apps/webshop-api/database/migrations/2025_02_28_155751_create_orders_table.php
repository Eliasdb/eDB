<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Foreign key to the Users table.
            $table->unsignedBigInteger('user_id');
            // Foreign key to the books table.
            $table->unsignedBigInteger('book_id');
            $table->integer('quantity')->default(1);
            $table->decimal('amount', 8, 2);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('order_date')->nullable();
            $table->timestamps();

            // Add foreign key constraints.
            // Adjust these if your users table name or primary key is different.
            $table->foreign('user_id')
                  ->references('Id') // change to 'id' if your Users table uses lowercase id.
                  ->on('Users')      // change to 'users' if necessary.
                  ->onDelete('cascade');

            $table->foreign('book_id')
                  ->references('id')
                  ->on('books')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
