<?php

namespace App\Filters\V1;
use App\Filters\ApiFilter;

class BooksFilter extends ApiFilter

{
    protected $allowedParms = [
        "customerId" => ["eq"],
        "title" => ["eq"],
        "author" => ["eq", "ne"],
        "status" => ["eq"],
        "publishedDate" => ["eq", "lt", "lte", "gt", "gte"],
        "lastLoanedDate" => ["eq", "lt", "lte", "gt", "gte"],
    ];

    protected $columnMap = [
        "customerId" => "customer_id",
        "publishedDate" => "published_date",
        "lastLoanedDate" => "lastLoanedDate"
    ];

    protected $operatorMap = [
        "eq" => "=",
        "lt" => "<",
        "lte" => "<=",
        "gt" => ">",
        "gte" => ">=",
        "ne" => "!=",
    ];
}