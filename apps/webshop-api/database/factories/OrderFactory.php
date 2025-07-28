<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            // These placeholders will be overridden in the seeder.
            'user_id'    => 1,
            'book_id'    => 1,
            'quantity'   => $this->faker->numberBetween(1, 10),
            'amount'     => $this->faker->randomFloat(2, 10, 100),
            'status'     => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
            'order_date' => Carbon::now()->subDays($this->faker->numberBetween(1, 30)),
        ];
    }
}
