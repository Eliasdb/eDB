<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genre = $this->faker->randomElement([
            'Drama', 'History', 'Adventure', 'Action', 'Non fiction',
            'Comedy', 'Crime', 'Fantasy', 'Mystery', 'Horror', 'Thriller'
        ]);
        $year = $this->faker->randomElement([
            '2001', '1999', '1927', '1997', '1967', '1985', '1963', '1977', '1998', '1989'
        ]);
        $sentence = $this->faker->sentence(10, true);

        return [
            "photo_url"      => "https://edit.org/images/cat/book-covers-big-2019101610.jpg",
            "description"    => $sentence,
            "title"          => $this->faker->name(),
            "genre"          => $genre,
            "author"         => $this->faker->name(),
            "status"         => "available",
            "published_date" => $year,
            "price"          => $this->faker->randomFloat(2, 5, 100),  // price between 5.00 and 100.00
            "stock"       => $this->faker->numberBetween(1, 50),     // quantity between 1 and 50
        ];
    }
}
