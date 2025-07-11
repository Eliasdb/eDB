<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        DB::table('books')->truncate();

        $this->call([
            // BookSeeder::class,
            CuratedBooksSeeder::class
            // OrderSeeder::class,
        ]);


    }
}
