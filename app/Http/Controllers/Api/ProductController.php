// store() validation
$validator = Validator::make($request->all(), [
    'name'             => 'required|string|max:255',
    'brand_name'       => 'required|string|max:255',
    'packaging_details'=> 'required|string',
    'price'            => 'required|numeric|min:0',
    'export_charges'   => 'nullable|numeric|min:0',
    'category_id'      => 'required|exists:categories,id',
    'image'            => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
    'is_active'        => 'nullable',
]);

// store() data array
$data = [
    'name'              => $request->name,
    'brand_name'        => $request->brand_name,
    'packaging_details' => $request->packaging_details,
    'price'             => $request->price,
    'export_charges'    => $request->export_charges,
    'category_id'       => $request->category_id,
    'is_active'         => true,
];

// update() validation
$validator = Validator::make($request->all(), [
    'name'              => 'sometimes|required|string|max:255',
    'brand_name'        => 'sometimes|required|string|max:255',
    'packaging_details' => 'sometimes|required|string',
    'price'             => 'sometimes|required|numeric|min:0',
    'export_charges'    => 'nullable|numeric|min:0',
    'category_id'       => 'sometimes|required|exists:categories,id',
    'image'             => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
    'is_active'         => 'nullable',
]);