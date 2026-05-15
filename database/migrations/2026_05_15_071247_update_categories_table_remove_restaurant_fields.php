<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {

            // Drop old columns only if they exist
            if (Schema::hasColumn('categories', 'small_heading')) {
                $table->dropColumn('small_heading');
            }
            if (Schema::hasColumn('categories', 'location')) {
                $table->dropColumn('location');
            }
            if (Schema::hasColumn('categories', 'is_royalty')) {
                $table->dropColumn('is_royalty');
            }
            if (Schema::hasColumn('categories', 'is_special_selection')) {
                $table->dropColumn('is_special_selection');
            }
            if (Schema::hasColumn('categories', 'order')) {
                $table->dropColumn('order');
            }
            if (Schema::hasColumn('categories', 'slug')) {
                $table->dropColumn('slug');
            }

            // Add description ONLY if it doesn't already exist
            if (!Schema::hasColumn('categories', 'description')) {
                $table->text('description')->nullable()->after('name');
            }

        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'description')) {
                $table->dropColumn('description');
            }
        });
    }
};