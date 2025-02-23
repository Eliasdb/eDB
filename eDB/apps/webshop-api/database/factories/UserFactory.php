<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $city = $this->faker->randomElement(['Antwerpen', 'Leuven', 'Gent', 'Eeklo', 'Brugge', 'Oostende', 'Brussel', 'Mariakerke', 'Sint-Niklaas', 'Lievegem', 'Maldegem']);
        $name = $this->faker->unique()->randomElement(['Erik', 'Sylvie', 'Gert', 'Karel', 'Patrick', 'Jef', 'Lisa', 'Peter', 'Fiona', 'Lize', 'Brecht', 'Dieter', 'Simon']);

        return [
            "first_name" =>  $this->faker->firstName(),
            "last_name" => $this->faker->lastName(),
            "email" => $this->faker->email(),
            "phone_number" => $this->faker->phoneNumber(),
            "address" => $this->faker->streetAddress(),
            "postal_code" => $this->faker->postCode(),
            "city" =>  $city,
            'name' => $name,
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
