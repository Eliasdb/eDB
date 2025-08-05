<?php

namespace App\Filters\V1;

use App\Filters\ApiFilter;

class CustomersFilter extends ApiFilter
{
    protected $allowedParms = [
        "firstName" => ["eq"],
        "lastName" => ["eq"],
        "email" => ["eq"],
        "phoneNumber" => ["eq"],
        "address" => ["eq"],
        "city" => ["eq"],
        "postalCode" => ['eq', 'gt', 'lt']
    ];

    protected $columnMap = [
        "firstName" => "first_name",
        "lastName" => "last_name",
        "phoneNumber" => "phone_number",
        "postalCode" => "postal_code"
    ];

    protected $operatorMap = [
        "eq" => "=",
        "lt" => "<",
        "lte" => "<=",
        "gt" => ">",
        "gte" => ">=",
    ];
}