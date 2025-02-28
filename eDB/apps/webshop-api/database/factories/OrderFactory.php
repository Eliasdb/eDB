<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            // Assuming you have users with IDs between 1 and 50
            'user_id'   => $this->faker->numberBetween(1, 50),
            // Assuming you have books with IDs between 1 and 100
            'book_id'   => $this->faker->numberBetween(1, 100),
            'quantity'  => $this->faker->numberBetween(1, 10),
            // Generate a random float for the amount (e.g., between 5.00 and 100.00)
            'amount'    => $this->faker->randomFloat(2, 5, 100),
            // Random status from the available options
            'status'    => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
            // Random date within the last year for the order date
            'order_date'=> $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
