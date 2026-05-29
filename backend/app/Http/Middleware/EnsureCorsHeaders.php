<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures CORS headers on all API responses (including OPTIONS preflight).
 */
class EnsureCorsHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->isApiRequest($request)) {
            return $next($request);
        }

        if ($request->isMethod('OPTIONS')) {
            return $this->applyCorsHeaders($request, response('', 204));
        }

        return $this->applyCorsHeaders($request, $next($request));
    }

    protected function isApiRequest(Request $request): bool
    {
        return $request->is('api/*')
            || str_starts_with($request->path(), 'api/');
    }

    protected function applyCorsHeaders(Request $request, Response $response): Response
    {
        $origin = $request->headers->get('Origin');

        if (! is_string($origin) || $origin === '' || ! $this->originAllowed($origin)) {
            return $response;
        }

        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, Accept, X-Requested-With, X-XSRF-TOKEN'
        );
        $response->headers->set('Access-Control-Max-Age', (string) config('cors.max_age', 3600));
        $response->headers->set('Vary', 'Origin', false);

        if (config('cors.supports_credentials')) {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
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
            if (is_string($pattern) && @preg_match($pattern, $origin) === 1) {
                return true;
            }
        }

        return false;
    }
}
