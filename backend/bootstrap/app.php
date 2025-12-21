<?php

if (! class_exists(\Fruitcake\Cors\HandleCors::class)) {
    class_alias(\Illuminate\Http\Middleware\HandleCors::class, \Fruitcake\Cors\HandleCors::class);
}

use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up'
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register CORS first so that preflight requests succeed before any
        // stateful or authentication middleware runs, preventing login/register
        // calls from failing with missing CORS headers in production.
        $middleware->use([HandleCors::class]);
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Customize exception handling if needed
    })->create();
