<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Book;
use Illuminate\Support\Facades\Log;

class OrderSeeder extends Seeder
{
    public function run()
    {
        // Log start
        $this->command->info('OrderSeeder started.');

        $users = User::all();
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Aborting seeder.');
            Log::warning('OrderSeeder: No users found.');
            return;
        }

        $books = Book::all();
        if ($books->isEmpty()) {
            $this->command->warn('No books found. Aborting seeder.');
            Log::warning('OrderSeeder: No books found.');
            return;
        }

        $this->command->info('Users count: ' . $users->count());
        $this->command->info('Books count: ' . $books->count());
        Log::info('Users count: ' . $users->count());
        Log::info('Books count: ' . $books->count());

        // Capture the command instance to use inside the closure.
        $command = $this->command;
        
        Order::factory()->count(50)
            ->state(function (array $attributes) use ($users, $books, $command) {
                $selectedUser = $users->random();
                $selectedBook = $books->random();
                $message = "Creating order for user ID: {$selectedUser->Id}, book ID: {$selectedBook->id}";
                $command->info($message);
                Log::info($message);
                return [
                    'user_id' => $selectedUser->Id,
                    'book_id' => $selectedBook->id,
                ];
            })
            ->create();

        $this->command->info('Order seeder completed successfully.');
        Log::info('OrderSeeder completed successfully.');
    }
}

