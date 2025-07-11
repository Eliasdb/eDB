<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\ImageManager;

class BooksPullCommand extends Command
{
    protected $signature = 'books:pull {isbns*} {--out=resources/data/books-raw.json}';
    protected $description = 'Fetch metadata from OpenLibrary for given ISBNs and write to a JSON file';

    public function handle(): int
    {
        $outFile = base_path($this->option('out'));
        $records = [];

        // Step 1: Load existing books if the file exists
        if (file_exists($outFile)) {
            $existing = json_decode(file_get_contents($outFile), true);
            if (is_array($existing)) {
                $records = $existing;
            }
        }

        // Step 2: Track existing ISBNs to avoid duplicates.
        $existingIsbns = array_column($records, 'isbn');

        foreach ($this->argument('isbns') as $isbn) {
            if (in_array($isbn, $existingIsbns)) {
                $this->warn("⚠️  Skipping {$isbn} – already in collection.");
                continue;
            }

            $this->info("📚 Fetching {$isbn} …");
            $res = Http::get("https://openlibrary.org/isbn/{$isbn}.json");

            if (! $res->successful()) {
                $this->warn("  → failed ({$res->status()})");
                continue;
            }

            $data = $res->json();
            $photoUrl = "https://covers.openlibrary.org/b/isbn/{$isbn}-L.jpg";
            $blurDataUrl = $this->generateBlurDataUrl($photoUrl);

            $records[] = [
                'isbn'          => $isbn,
                'title'         => $data['title'] ?? 'Untitled',
                'author'        => $data['by_statement'] ?? 'Unknown',
                'description'   => is_array($data['description'] ?? null)
                    ? $data['description']['value']
                    : ($data['description'] ?? ''),
                'publishedDate' => $data['publish_date'] ?? '',
                'genre'         => 'Classic',
                'photoUrl'      => $photoUrl,
                'blurDataUrl'   => $blurDataUrl,
                'price'         => rand(10, 30),
                'quantity'      => rand(1, 10),
                'stock'         => rand(1, 10),
                'status'        => 'available',
            ];
        }

        // Step 3: Save updated book collection.
        $json = json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents($outFile, $json);

        $this->info("✅  Saved " . count($records) . " total record(s) → {$outFile}");
        return self::SUCCESS;
    }

    private function generateBlurDataUrl(string $url): ?string
    {
        try {
            $response = Http::get($url);
            if (! $response->successful()) {
                $this->warn("⚠️ Failed to download image from {$url}");
                return null;
            }

            $manager = ImageManager::gd(); // Use GD driver
            $image = $manager->read($response->body())
                ->resize(20, 20)
                ->blur(10);

            // First encode it (AutoEncoder), which returns EncodedImage
            $encoded = $image->encode();

            // Now wrap it in a data URI
            return $encoded->toDataUri();

        } catch (\Throwable $e) {
            $this->warn("❌ Failed to blur image for {$url}: {$e->getMessage()}");
            return null;
        }
    }



}
