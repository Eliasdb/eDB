<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Meilisearch\Client;

class MeilisearchIndexSeeder extends Seeder
{
    public function run()
    {
        $client = new Client(env('MEILISEARCH_HOST'), env('MEILISEARCH_KEY'));
        $index = $client->index('books');

        $index->updateFilterableAttributes(["genre", "author", "status", "title", "published_date", "price", "stock"]);
    }
}
