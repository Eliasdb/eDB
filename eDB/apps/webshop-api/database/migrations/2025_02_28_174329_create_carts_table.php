<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique(); // one cart per user
            $table->timestamps();

            // If you have a Users table using default naming:
            $table->foreign('user_id')->references('Id')->on('Users')->onDelete('cascade');
            // If your Users table uses a different naming (like 'Users' with capital U), adjust accordingly.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
