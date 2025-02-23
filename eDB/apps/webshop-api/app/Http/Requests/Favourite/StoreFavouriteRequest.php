<?php

namespace App\Http\Requests\Favourite;

use Illuminate\Foundation\Http\FormRequest;

class StoreFavouriteRequest extends FormRequest
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
            // "status" =>["required", Rule::in(["loaned out", "in stock"])],
            "author" => ["required"],
            "status" => ["required"],
            "genre" => ["required"],
            "publishedDate" => ["required"],
            "userId" => ["required"],
            "originalId" => ["required"],

        ];
    }

    protected function prepareForValidation()
    {
        if ($this->publishedDate) {
            $this->merge([
            "published_date" => $this->publishedDate
        ]);
        }

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


        if ($this->originalId) {
            $this->merge([
                "original_id" => $this->originalId
            ]);
        }
    }
}
