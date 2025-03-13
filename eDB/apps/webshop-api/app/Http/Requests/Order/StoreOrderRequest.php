<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Transform orderDate (if provided) to order_date.
        if ($this->has('orderDate')) {
            $this->merge([
                'order_date' => $this->orderDate,
            ]);
        }

        // Transform nested items keys from camelCase to snake_case.
        if ($this->has('items') && is_array($this->items)) {
            $transformedItems = [];
            foreach ($this->items as $item) {
                $transformed = [];
                foreach ($item as $key => $value) {
                    // Convert keys like "bookId" to "book_id", etc.
                    $transformed[Str::snake($key)] = $value;
                }
                $transformedItems[] = $transformed;
            }
            $this->merge(['items' => $transformedItems]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.book_id' => 'required|exists:books,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'order_date' => 'nullable|date',
        ];
    }
}
