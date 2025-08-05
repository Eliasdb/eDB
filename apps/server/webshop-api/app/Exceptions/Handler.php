<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Log or report exceptions if needed.
        });

        $this->renderable(function (Throwable $e, $request) {
            // Check if the request expects a JSON response
            if ($request->wantsJson()) {
                // If it's an instance of HttpException, get its status code; otherwise default to 500.
                $status = $e instanceof HttpException ? $e->getStatusCode() : 500;
                return response()->json([
                    'error' => $e->getMessage(),
                ], $status);
            }
        });
    }
}
