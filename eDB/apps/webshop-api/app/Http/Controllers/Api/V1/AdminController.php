<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function adminStats(Request $request)
    {
        $users = User::get()->all();
        $books = Book::get()->all();
        $loaned_books = Book::where('status', '=', 'loaned')->get()->all();

        $action_books = Book::where('genre', '=', 'action')->get()->all();
        // $drama_books = Book::where('genre', '=', 'drama')->get()->all();
        // $fantasy_books = Book::where('genre', '=', 'fantasy')->get()->all();
        // $history_books = Book::where('genre', '=', 'history')->get()->all();
        // $horror_books = Book::where('genre', '=', 'horror')->get()->all();
        // $mystery_books = Book::where('genre', '=', 'mystery')->get()->all();
        // $non_fiction_books = Book::where('genre', '=', 'non fiction')->get()->all();
        // $thriller_books = Book::where('genre', '=', 'thriller')->get()->all();

        // $count_array = [count($action_books), count($adventure_books), count($comedy_books), count($crime_books),
        // count($drama_books), count($fantasy_books), count($history_books),count($horror_books), count($mystery_books),

        $genres = ['action', 'adventure', 'comedy', 'crime', 'drama', 'fantasy', 'history', 'horror', 'mystery', 'non fiction', 'thriller' ];

        function getTotalsByGenre(array $genres)
        {
            $totals_array = [];

            foreach ($genres as $genre) {
                array_push($totals_array, count(Book::where('genre', '=', $genre)->get()->all()));
            }

            return $totals_array;
        }


        function getUserData()
        {
            $users = DB::select(
                "SELECT name FROM users 
                GROUP BY name
                HAVING COUNT(name) = 1
                LIMIT 20
                "
            );

            $user_array = [];

            foreach ($users as $user) {
                array_push($user_array, [
                "user" => $user->name,
                "posts" => count(Post::where('username', '=', $user->name)->get()->all()),
                'comments' => count(Comment::where('poster', '=', $user->name)->get()->all())
            ]);
            }

            return $user_array;
        }

        function getUsersPerCity()
        {
            $cities = DB::select(
                "SELECT city FROM users 
                GROUP BY city
                "
            );

            $city_array = [];

            foreach ($cities as $city) {
                array_push($city_array, [
                "city" => $city->city,
                "count" => count(User::where('city', '=', $city->city)->get()->all()),
            ]);
            }

            return  $city_array;
        }

        return [
            'data' => [
                'userCount' => count($users),
                'bookCount' => count($books),
                'loanedBooksCount' => count($loaned_books),
                'test' => count($action_books),
                'totalsByGenre' => getTotalsByGenre($genres),
                'userData' =>  getUserData(),
                'totalsByCity' => getUsersPerCity()
            ],

        ];


    }

}
