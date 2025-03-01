<?php

namespace App\Http\Requests;

use App\Models\Book;
use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:books,id'],
            'selectedAmount' => [
                'required', 'integer', 'min:1',
                function ($attribute, $value, $fail) {
                    $book = Book::find($this->id);
                    if ($book && $value > $book->stock) {
                        $fail("The selected amount ($value) exceeds the available stock ({$book->stock}).");
                    }
                },
            ],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'book_id' => $this->id,
            'selected_amount' => $this->selectedAmount,
        ]);
    }
}
