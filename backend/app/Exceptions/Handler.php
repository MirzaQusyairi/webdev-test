<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (AuthenticationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthenticated or token expired.'
                ], 401);
            }
        });
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // Always return JSON for unauthenticated, regardless of Accept header
        return response()->json([
            'message' => 'Unauthenticated or token expired.'
        ], 401);
    }

    public function render($request, Throwable $e)
    {
        // Always return JSON for all exceptions on API routes
        if ($request->is('api/*')) {
            $status = 500;
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                $status = $e->getStatusCode();
            }
            return response()->json([
                'message' => $e->getMessage() ?: 'Server Error',
            ], $status);
        }
        return parent::render($request, $e);
    }
}
