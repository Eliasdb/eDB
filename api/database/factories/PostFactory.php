<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->randomElement(['Erik', 'Sylvie', 'Gert', 'Karel', 'Patrick', 'Jef', 'Lisa', 'Peter', 'Fiona', 'Lize', 'Brecht', 'Dieter', 'Simon']);
        return [
            "user_id" =>  $this->faker->randomNumber(1, 500),
            "username" => $name,
            "photo_url" => 'https://material.angular.io/assets/img/examples/shiba1.jpg',
            "content" => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, deserunt quir. 
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, deserunt quir.',
        ];
    }
}
