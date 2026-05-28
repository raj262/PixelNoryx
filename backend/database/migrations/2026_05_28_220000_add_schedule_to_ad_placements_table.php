<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->date('starts_at')->nullable()->after('is_active');
            $table->date('ends_at')->nullable()->after('starts_at');
        });

        $today = now()->toDateString();
        $oneYear = now()->addYear()->toDateString();

        \Illuminate\Support\Facades\DB::table('ad_placements')
            ->whereNull('starts_at')
            ->update([
                'starts_at' => $today,
                'ends_at' => $oneYear,
            ]);
    }

    public function down(): void
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dropColumn(['starts_at', 'ends_at']);
        });
    }
};
