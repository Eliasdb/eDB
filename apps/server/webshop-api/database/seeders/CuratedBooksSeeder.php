<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Book;

class CuratedBooksSeeder extends Seeder
{
    public function run(): void
    {
        Book::truncate();

        $path = base_path('resources/data/books-raw.json');
        if (! File::exists($path)) {
            $this->command->error("File {$path} not found – run books:pull first.");
            return;
        }

        $records = json_decode(File::get($path), true);
        $count = 0;

        foreach ($records as $r) {
            Book::updateOrCreate(
                ['photo_url' => $r['photoUrl']],
                [
                    'title'          => $r['title'],
                    'author'         => $r['author'],
                    'description'    => $r['description'],
                    'published_date' => $r['publishedDate'],
                    'genre'          => $r['genre'],
                    'photo_url'      => $r['photoUrl'],
                    'blur_data_url'  => $r['blurDataUrl'] ?? null, // 👈 just read from JSON
                    'price'          => $r['price'],
                    'quantity'       => $r['quantity'],
                    'stock'          => $r['stock'],
                    'status'         => $r['status'],
                ]
            );

            $count++;
        }

        $this->command->info("📚  Curated book list seeded: {$count} items.");
    }
}
