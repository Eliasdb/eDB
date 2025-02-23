<?php

namespace App\Http\Requests\Comment;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
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
            "postId" => ["required"],
            "poster" => ["required"],
            "photoUrl" => ["required"],
            "content" => ["required"],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->postId) {
            $this->merge([
            "post_id" => $this->postId
        ]);
        }

        if ($this->photoUrl) {
            $this->merge([
                "photo_url" => $this->photoUrl
            ]);
        }
    }
}
