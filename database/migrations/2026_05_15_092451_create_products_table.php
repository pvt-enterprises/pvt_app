<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('brand_name')->nullable();
                $table->text('packaging_details')->nullable();
                $table->decimal('price', 10, 2)->default(0);
                $table->decimal('export_charges', 10, 2)->nullable();
                $table->text('description')->nullable();
                $table->string('image')->nullable();
                $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};