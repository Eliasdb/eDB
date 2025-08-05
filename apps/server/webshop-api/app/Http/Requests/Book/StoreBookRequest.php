<?php

namespace App\Http\Requests\Book;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => ["required"],
            "photoUrl" => ["required"],
            "description" => ["required"],
            // "status" =>["required", Rule::in(["loaned out", "in stock"])],
            "author" => ["required"],
            "status" => ["required"],
            "genre" => ["required"],
            "publishedDate" => ["required"],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->publishedDate) {
            $this->merge([
            "published_date" => $this->publishedDate
        ]);
        }

        if ($this->photoUrl) {
            $this->merge([
                "photo_url" => $this->photoUrl
            ]);
        }
    }
}
