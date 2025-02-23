<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
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
            $table->string("name");
            $table->integer("price");
            $table->string("image");
            $table->json("colors");
            $table->string("company");
            $table->string("description");
            $table->string("category");
            $table->boolean("shipping");
            "name" => $name,
            "photo_url" => 'https://material.angular.io/assets/img/examples/shiba1.jpg',
            "content" => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, deserunt quir. 
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, deserunt quir.',
        ];
    }
}
