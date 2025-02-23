<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
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
        $method = $this->method();

        if ($method == "PUT") {
            return [
                    "userId" => ["required"],
                    "photoUrl" => ["required"],
                    "description" => ["required"],
                    "title" => ["required"],
                    "author" => ["required"],
                    "genre" => ["required"],
                    "status" => ["required"],
                    "publishedDate" => ["required"],
                    "lastLoanedDate" => ["required"],
                    ];
        }
        if ($method == "PATCH") {
            return [
                "userId" => ["sometimes", "required"],
                "photoUrl" => ["sometimes", "required"],
                "description" => ["sometimes", "required"],
                "title" => ["sometimes", "required"],
                "author" => ["sometimes", "required"],
                "genre" => ["sometimes", "required"],
                "status" => ["sometimes", "required"],
                "publishedDate" => ["sometimes", "required"],
                "lastLoanedDate" => ["sometimes", "required"],
                ];
        }

    }

    protected function prepareForValidation()
    {

        if ($this->userId) {
            $this->merge([
                "user_id" => $this->userId
            ]);
        }

        if ($this->photoUrl) {
            $this->merge([
                "photo_url" => $this->photoUrl
            ]);
        }


        if ($this->publishedDate) {
            $this->merge([
            "published_date" => $this->publishedDate
        ]);
        }

        if ($this->lastLoanedDate) {
            $this->merge([
            "last_loaned_date" => $this->lastLoanedDate
        ]);
        }

    }

}
