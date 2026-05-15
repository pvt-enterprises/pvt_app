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