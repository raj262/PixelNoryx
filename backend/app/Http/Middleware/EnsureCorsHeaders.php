<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Fallback CORS headers when upstream (nginx) strips Laravel's HandleCors output.
 */
class EnsureCorsHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 204);
        } else {
            $response = $next($request);
        }

        if (! $request->is('api/*') && ! $request->is('sanctum/csrf-cookie')) {
            return $response;
        }

        $origin = $request->headers->get('Origin');
        if (! is_string($origin) || $origin === '') {
            return $response;
        }

        if (! $this->originAllowed($origin)) {
            return $response;
        }

        if (! $response->headers->has('Access-Control-Allow-Origin')) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Vary', 'Origin', false);
        }

        if (! $response->headers->has('Access-Control-Allow-Methods')) {
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        }

        if (! $response->headers->has('Access-Control-Allow-Headers')) {
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
        }

        return $response;
    }

    protected function originAllowed(string $origin): bool
    {
        $origin = rtrim($origin, '/');
        $allowed = config('cors.allowed_origins', []);

        if (in_array($origin, $allowed, true)) {
            return true;
        }

        foreach (config('cors.allowed_origins_patterns', []) as $pattern) {
            if (@preg_match($pattern, $origin) === 1) {
                return true;
            }
        }

        return false;
    }
}
