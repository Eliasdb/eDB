<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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
            "userId" => ["required"],
            "username" => ["required"],
            "photoUrl" => ["required"],
            "content" => ["required"],
        ];
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
    }
}
