<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand_name',
        'packaging_details',
        'price',
        'export_charges',
        'image',
        'category_id',
        'is_active'
    ];

    protected $casts = [
        'is_active'      => 'boolean',
        'price'          => 'decimal:2',
        'export_charges' => 'decimal:2',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    // Relationship — belongs to a category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Scope for active products only
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}