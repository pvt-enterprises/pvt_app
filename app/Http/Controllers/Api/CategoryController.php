<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;

class CategoryController extends Controller
{
    // ─── Helper: init Cloudinary ───────────────────────────────
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

    // ─── Helper: delete image from Cloudinary ─────────────────
    private function deleteFromCloudinary(string $imageUrl, Cloudinary $cloudinary): void
    {
        try {
            if (preg_match('/\/v\d+\/(.+)\.\w+$/', $imageUrl, $matches)) {
                $cloudinary->uploadApi()->destroy($matches[1], ['resource_type' => 'image']);
                \Log::info('Deleted from Cloudinary', ['public_id' => $matches[1]]);
            }
        } catch (\Exception $e) {
            \Log::warning('Cloudinary delete failed', ['error' => $e->getMessage()]);
        }
    }

    // ─── Helper: upload image to Cloudinary ───────────────────
    private function uploadToCloudinary($file): string
    {
        if (!$file->isValid()) {
            throw new \Exception('Uploaded file is not valid');
        }

        $cloudinary = $this->getCloudinary();

        $result = $cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'        => 'categories',
                'resource_type' => 'image',
                'transformation' => [
                    ['width' => 285, 'height' => 336, 'crop' => 'fill', 'quality' => 'auto']
                ]
            ]
        );

        if (!isset($result['secure_url'])) {
            throw new \Exception('Cloudinary upload failed — no URL returned');
        }

        return $result['secure_url'];
    }

    // ─── INDEX ─────────────────────────────────────────────────
    public function index()
    {
        try {
            $categories = Category::orderBy('name', 'asc')->get();

            return response()->json(['success' => true, 'data' => $categories]);

        } catch (\Exception $e) {
            \Log::error('Fetch categories failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories'
            ], 500);
        }
    }

    // ─── SHOW ──────────────────────────────────────────────────
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $category]);
    }

    // ─── STORE ─────────────────────────────────────────────────
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'is_active'   => 'nullable',
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

            $category = Category::create([
                'name'        => $request->name,
                'description' => $request->description,
                'image'       => $imageUrl,
                'is_active'   => $request->is_active == '1' || !$request->has('is_active'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data'    => $category
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Category create failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // ─── UPDATE ────────────────────────────────────────────────
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'is_active'   => 'nullable',
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

            if ($request->has('name'))        $data['name']        = $request->name;
            if ($request->has('description')) $data['description'] = $request->description;
            if ($request->has('is_active'))   $data['is_active']   = $request->is_active == '1';

            // Replace image if new one uploaded
            if ($request->hasFile('image')) {
                // Delete old Cloudinary image
                if ($category->image && str_contains($category->image, 'cloudinary.com')) {
                    $this->deleteFromCloudinary($category->image, $this->getCloudinary());
                }
                $data['image'] = $this->uploadToCloudinary($request->file('image'));
            }

            $category->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data'    => $category
            ]);

        } catch (\Exception $e) {
            \Log::error('Category update failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // ─── DESTROY ───────────────────────────────────────────────
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        try {
            if ($category->image && str_contains($category->image, 'cloudinary.com')) {
                $this->deleteFromCloudinary($category->image, $this->getCloudinary());
            }

            $category->delete();

            return response()->json(['success' => true, 'message' => 'Category deleted successfully']);

        } catch (\Exception $e) {
            \Log::error('Category delete failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}