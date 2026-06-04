<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;

class ProductController extends Controller
{
    private function getCloudinary(): Cloudinary
    {
        return new Cloudinary([
            'cloud' => [
                'cloud_name' => config('cloudinary.cloud_name'),
                'api_key'    => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret'),
            ],
            'url' => ['secure' => true]
        ]);
    }

    private function deleteFromCloudinary(string $imageUrl, Cloudinary $cloudinary): void
    {
        try {
            if (preg_match('/\/v\d+\/(.+)\.\w+$/', $imageUrl, $matches)) {
                $cloudinary->uploadApi()->destroy($matches[1], ['resource_type' => 'image']);
            }
        } catch (\Exception $e) {
            \Log::warning('Cloudinary delete failed', ['error' => $e->getMessage()]);
        }
    }

    private function uploadToCloudinary($file): string
    {
        if (!$file->isValid()) {
            throw new \Exception('Uploaded file is not valid');
        }

        $result = $this->getCloudinary()->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'        => 'products',
                'resource_type' => 'image',
                'transformation' => [
                    ['width' => 500, 'height' => 500, 'crop' => 'fill', 'quality' => 'auto']
                ]
            ]
        );

        if (!isset($result['secure_url'])) {
            throw new \Exception('Cloudinary upload failed');
        }

        return $result['secure_url'];
    }

    // INDEX
    public function index()
    {
        try {
            $products = Product::with(['category', 'images'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['success' => true, 'data' => $products]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch products'], 500);
        }
    }

    // SHOW
    public function show($id)
    {
        $product = Product::with(['category', 'images'])->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $product]);
    }

    // STORE
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'              => 'required|string|max:255',
            'brand_name'        => 'required|string|max:255',
            'packaging_details' => 'required|string',
            'price'             => 'nullable|numeric|min:0',
            'export_charges'    => 'nullable|numeric|min:0',
            'category_id'       => 'nullable|exists:categories,id',
            'image'             => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'is_active'         => 'nullable',
            'additional_images'   => 'nullable|array|max:5',       // ← ADD
            'additional_images.*' => 'image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $imageUrl = $this->uploadToCloudinary($request->file('image'));

            $product = Product::create([
                'name'              => $request->name,
                'brand_name'        => $request->brand_name,
                'packaging_details' => $request->packaging_details,
                'price'             => $request->price ?? 0,
                'export_charges'    => $request->export_charges,
                'category_id'       => $request->category_id,
                'image'             => $imageUrl,
                'is_active'         => true,
            ]);

            // Handle additional images (up to 6 total including main)
            $additionalImages = $request->file('additional_images', []);
            $sortOrder = 1;
            foreach (array_slice($additionalImages, 0, 5) as $img) {
                if ($img->isValid()) {
                    $url = $this->uploadToCloudinary($img);
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url'  => $url,
                        'sort_order' => $sortOrder++,
                    ]);
                }
            }
            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data'    => $product
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Product create failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'              => 'sometimes|required|string|max:255',
            'brand_name'        => 'sometimes|required|string|max:255',
            'packaging_details' => 'sometimes|required|string',
            'price'             => 'nullable|numeric|min:0',
            'export_charges'    => 'nullable|numeric|min:0',
            'category_id'       => 'nullable|exists:categories,id',
            'image'             => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'additional_images'   => 'nullable|array|max:5',       // ← ADD
            'additional_images.*' => 'image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'is_active'         => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $data = [];

            if ($request->has('name'))              $data['name']              = $request->name;
            if ($request->has('brand_name'))        $data['brand_name']        = $request->brand_name;
            if ($request->has('packaging_details')) $data['packaging_details'] = $request->packaging_details;
            if ($request->has('price'))             $data['price']             = $request->price ?? 0;
            if ($request->has('export_charges'))    $data['export_charges']    = $request->export_charges;
            if ($request->has('category_id'))       $data['category_id']       = $request->category_id;
            if ($request->has('is_active'))         $data['is_active']         = $request->is_active == '1';

            if ($request->hasFile('image')) {
                if ($product->image && str_contains($product->image, 'cloudinary.com')) {
                    $this->deleteFromCloudinary($product->image, $this->getCloudinary());
                }
                $data['image'] = $this->uploadToCloudinary($request->file('image'));
            }

            $product->update($data);

            // Add new additional images
            $additionalImages = $request->file('additional_images', []);
            $existingCount = $product->images()->count();
            $allowedMore = max(0, 5 - $existingCount);
            $sortOrder = $product->images()->max('sort_order') + 1 ?: 1;

            foreach (array_slice($additionalImages, 0, $allowedMore) as $img) {
                if ($img->isValid()) {
                    $url = $this->uploadToCloudinary($img);
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url'  => $url,
                        'sort_order' => $sortOrder++,
                    ]);
                }
            }
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data'    => $product
            ]);

        } catch (\Exception $e) {
            \Log::error('Product update failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // DESTROY
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        try {
            if ($product->image && str_contains($product->image, 'cloudinary.com')) {
                $this->deleteFromCloudinary($product->image, $this->getCloudinary());
            }

            foreach ($product->images as $img) {
                $this->deleteFromCloudinary($img->image_url, $this->getCloudinary());
                $img->delete();
            }
            $product->delete();

            return response()->json(['success' => true, 'message' => 'Product deleted successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
    public function deleteImage($imageId)
    {
        $image = ProductImage::find($imageId);
        if (!$image) {
            return response()->json(['success' => false, 'message' => 'Image not found'], 404);
        }
        try {
            $this->deleteFromCloudinary($image->image_url, $this->getCloudinary());
            $image->delete();
            return response()->json(['success' => true, 'message' => 'Image deleted']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete image'], 500);
        }
    }
}