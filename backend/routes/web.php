<?php

use Illuminate\Support\Facades\Route;

/*
| Site root → Filament admin login (no redirect loop after auth).
| Dashboard lives at /admin once logged in.
*/
Route::redirect('/', '/admin/login');
