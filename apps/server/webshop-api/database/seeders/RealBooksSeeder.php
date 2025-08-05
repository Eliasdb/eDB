<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Book;

class RealBooksSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            ['title' => '1984', 'isbn' => '0451524934'],
            ['title' => 'To Kill a Mockingbird', 'isbn' => '0061120081'],
            ['title' => 'The Great Gatsby', 'isbn' => '0743273567'],
            ['title' => 'Pride and Prejudice', 'isbn' => '0141439513'],
            ['title' => 'The Hobbit', 'isbn' => '054792822X'],
            ['title' => 'Moby-Dick', 'isbn' => '1503280780'],
            ['title' => 'Brave New World', 'isbn' => '0060850523'],
            ['title' => 'Fahrenheit 451', 'isbn' => '1451673310'],
            ['title' => 'Jane Eyre', 'isbn' => '0141441143'],
            ['title' => 'The Catcher in the Rye', 'isbn' => '0316769487'],
            // ➕ Add more if you like
        ];

        foreach ($books as $entry) {
            $isbn = $entry['isbn'];
            $response = Http::get("https://openlibrary.org/isbn/{$isbn}.json");

            if (!$response->successful()) {
                echo "Failed to fetch data for ISBN: {$isbn}\n";
                continue;
            }

            $data = $response->json();

            $description = is_array($data['description'] ?? null)
                ? $data['description']['value']
                : ($data['description'] ?? 'No description');

            // Remove newline + "--back cover"
            $description = preg_replace('/\r?\n--back cover$/i', '', $description);

            Book::create([
                'title' => $data['title'] ?? $entry['title'],
                'author' => $data['by_statement'] ?? 'Unknown',
                'description' => $description,
                'published_date' => $data['publish_date'] ?? 'Unknown',
                'genre' => 'Classic', // or random genre
                'photo_url' => "https://covers.openlibrary.org/b/isbn/{$isbn}-L.jpg",
                'price' => rand(10, 30),
                'quantity' => rand(1, 10),
                'stock' => rand(1, 10),
                'status' => 'available',
            ]);
        }
    }
}
