<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('genre');
            $table->string('author');
            $table->string('status')->default('available');
            $table->integer('quantity')->default(0);
            $table->integer('stock')->default(0);
            $table->decimal('price', 8, 2);
            $table->string('photo_url');
            $table->text('description')->nullable();
            $table->string('published_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
