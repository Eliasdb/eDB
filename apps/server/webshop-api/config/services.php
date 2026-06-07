<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'stripe' => [
        'key' => env('STRIPE_PUBLIC'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'checkout' => [
        'frontend_url' => rtrim(env('FRONTEND_URL', 'http://localhost:4200'), '/'),
        'success_url' => env(
            'CHECKOUT_SUCCESS_URL',
            rtrim(env('FRONTEND_URL', 'http://localhost:4200'), '/') . '/webshop/checkout/success?session_id={CHECKOUT_SESSION_ID}'
        ),
        'cancel_url' => env(
            'CHECKOUT_CANCEL_URL',
            rtrim(env('FRONTEND_URL', 'http://localhost:4200'), '/') . '/webshop/checkout'
        ),
    ],

];
