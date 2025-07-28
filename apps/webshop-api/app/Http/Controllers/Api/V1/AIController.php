<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Resources\V1\Book\BookResource;
use App\Services\BookService;

class AIController extends Controller
{
    public function __construct(
        protected BookService $bookService
    ) {
    }

    public function handle(Request $request)
    {
        $query = $request->input('query');

        // Step 1: Ask GPT to convert natural language into supported filters.
        $openaiResponse = Http::withToken(env('OPENAI_API_KEY'))->post(
            'https://api.openai.com/v1/chat/completions',
            [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => <<<PROMPT
You are an API assistant. Convert natural language into JSON filters for a book API.

Only include filters if clearly present in the query.

Valid keys are:
- genre
- author
- status
- title
- published_date
- searchFilter
- price
- stock

Format values like this:
- For "under 20" → { "price": "<20" }
- For "between 3 and 10" → { "stock": "3 - 10" }
- For "at least 5" → { "stock": ">4" }
- For "exactly 10" → { "stock": "10" }

Respond with a flat JSON object. Example:
{ "genre": "classic", "author": "neruda", "status": "available" }
PROMPT
                    ],
                    [
                        'role' => 'user',
                        'content' => $query,
                    ],
                ]
            ]
        );

        $filters = json_decode($openaiResponse->json('choices.0.message.content') ?? '{}', true);

        // Step 2: Validate and clean up filter keys
        $allowedKeys = ['genre', 'author', 'status', 'title', 'published_date', 'searchFilter', 'price', 'stock'];
        $mappedFilters = [];

        foreach ($filters as $key => $value) {
            $key = trim($key);
            if (in_array($key, $allowedKeys)) {
                $mappedFilters[$key] = $value;
            }
        }

        // Step 3: Query your book service using AI method
        $offset = (int) $request->input('offset', 0);
        $limit = (int) $request->input('limit', 15);

        if (empty($mappedFilters)) {
            return response()->json([
                'query' => $query,
                'filters_used' => [],
                'items' => [],
                'total' => 0,
                'hasMore' => false,
                'error' => 'No usable filters detected from your query.'
            ]);
        }

        $result = $this->bookService->getBooksFromAI($mappedFilters, $offset, $limit);

        return response()->json([
            'query' => $query,
            'filters_used' => $mappedFilters,
            'items' => BookResource::collection($result['books']),
            'total' => $result['total'],
            'hasMore' => ($offset + $limit) < $result['total'],
        ]);
    }
}
