<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('user_id'); // Keycloak `sub`
            $table->decimal('total_price', 10, 2); // 🔹 Store total order price
            $table->enum('status', ['pending', 'paid', 'shipped', 'cancelled'])->default('pending'); // 🔹 Order status
            $table->timestamps();
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
