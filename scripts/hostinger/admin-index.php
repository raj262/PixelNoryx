<?php

/**
 * Hostinger entry for admin.rajeshcodes.in
 * Document root: public_html/admin
 * Laravel app:   public_html/subdomainfile
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$base = dirname(__DIR__).'/subdomainfile';

if (file_exists($maintenance = $base.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $base.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $base.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
