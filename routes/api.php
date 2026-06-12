<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserResponseController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HeroBannerController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\MenuLinkController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\FooterLinkController;
use App\Http\Controllers\Api\ProductController;

// ============================================
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ============================================
// Handle CORS preflight
Route::options('{any}', function() {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
})->where('any', '.*');
// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Categories (Public)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Pages (Public)
Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{page}', [PageController::class, 'show']);

// Hero Banners (Public)
Route::get('/hero-banners', [HeroBannerController::class, 'index']);
Route::get('/hero-banners/{heroBanner}', [HeroBannerController::class, 'show']);

Route::get('/gallery', [GalleryController::class, 'index']);

// Settings (Public)
Route::get('/settings', [SettingsController::class, 'index']);

// Menu Links (Public)
Route::get('/menu-links', [MenuLinkController::class, 'index']);

// Footer Links (Public)
Route::get('/footer-links', [FooterLinkController::class, 'index']);

// Public contact/booking
Route::post('/user-responses', [UserResponseController::class, 'store']);

// Products (Public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// ============================================
// PROTECTED ROUTES (AUTH REQUIRED)
// ============================================

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Categories (Admin)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::post('/categories/{id}', [CategoryController::class, 'update']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // User Responses (Admin)
    Route::get('/user-responses', [UserResponseController::class, 'index']);
    Route::get('/user-responses/{userResponse}', [UserResponseController::class, 'show']);
    Route::put('/user-responses/{userResponse}', [UserResponseController::class, 'update']);
    Route::delete('/user-responses/{userResponse}', [UserResponseController::class, 'destroy']);

    // Pages (Admin CRUD)
    Route::post('/pages', [PageController::class, 'store']);
    Route::post('/pages/{id}', [PageController::class, 'update']);
    Route::patch('/pages/{id}/status', [PageController::class, 'updateStatus']);
    Route::delete('/pages/{id}', [PageController::class, 'destroy']);

    // Hero Banners (Admin CRUD)
    Route::post('/hero-banners', [HeroBannerController::class, 'store']);
    Route::put('/hero-banners/{heroBanner}', [HeroBannerController::class, 'update']);
    Route::delete('/hero-banners/{heroBanner}', [HeroBannerController::class, 'destroy']);

    
    // Menu Links (Admin CRUD - except public index)
    Route::post('/menu-links', [MenuLinkController::class, 'store']);
    Route::get('/menu-links/{id}', [MenuLinkController::class, 'show']);
    Route::put('/menu-links/{id}', [MenuLinkController::class, 'update']);
    Route::patch('/menu-links/{id}/toggle', [MenuLinkController::class, 'toggle']);
    Route::delete('/menu-links/{id}', [MenuLinkController::class, 'destroy']);

    // Settings (Admin)
    Route::post('/settings', [SettingsController::class, 'update']);
    Route::post('/clear-cache', [SettingsController::class, 'clearCache']);

    // Roles (Admin)
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{id}', [RoleController::class, 'show']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

    // Users (Admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Footer Links (Admin CRUD - except public index)
    Route::post('/footer-links', [FooterLinkController::class, 'store']);
    Route::get('/footer-links/{id}', [FooterLinkController::class, 'show']);
    Route::put('/footer-links/{id}', [FooterLinkController::class, 'update']);
    Route::patch('/footer-links/{id}/toggle', [FooterLinkController::class, 'toggle']);
    Route::delete('/footer-links/{id}', [FooterLinkController::class, 'destroy']);

    // Products (Admin)
    Route::delete('/products/images/{imageId}', [ProductController::class, 'deleteImage']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

// ============================================
// DEBUG/TEST ROUTES
// ============================================

Route::get('/test-storage', function () {
    return response()->json([
        'storage_path' => storage_path('app/public'),
        'public_path' => public_path('storage'),
        'symlink_exists' => is_link(public_path('storage')),
        'symlink_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : null,
        'public_storage_exists' => file_exists(public_path('storage')),
        'files_in_hero_banners' => \Illuminate\Support\Facades\Storage::disk('public')->allFiles('hero-banners'),
        'app_url' => config('app.url'),
        'filesystem_disk' => config('filesystems.default'),
        'storage_url' => config('filesystems.disks.public.url'),
    ]);
});

Route::get('/test-cloudinary', function() {
    try {
        $configured = config('cloudinary.cloud_name') !== null;
        return response()->json([
            'cloudinary_configured' => $configured,
            'cloud_name' => config('cloudinary.cloud_name'),
            'has_api_key' => !empty(config('cloudinary.api_key')),
            'package_installed' => class_exists('CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary')
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::get('/debug-logs', function() {
    $logFile = storage_path('logs/laravel.log');
    if (file_exists($logFile)) {
        $logs = file_get_contents($logFile);
        $lastError = substr($logs, -15000);
        return response('<pre>' . htmlspecialchars($lastError) . '</pre>');
    }
    return 'No logs found';
});

Route::get('/debug-errors', function() {
    $logFile = storage_path('logs/laravel.log');
    if (!file_exists($logFile)) return 'No logs found';
    $lines = file($logFile);
    $errors = array_filter($lines, fn($l) => str_contains($l, 'ERROR') || str_contains($l, 'Exception') || str_contains($l, 'SQLSTATE'));
    return response('<pre>' . htmlspecialchars(implode('', array_slice($errors, -20))) . '</pre>');
});

Route::get('/test-gallery', function() {
    $gallery = \App\Models\GalleryImage::all();
    return response()->json([
        'total_images' => $gallery->count(),
        'images' => $gallery->map(function($img) {
            return [
                'id' => $img->id,
                'title' => $img->title,
                'image_url' => $img->image,
                'is_active' => $img->is_active,
                'is_cloudinary' => str_starts_with($img->image ?? '', 'https://res.cloudinary.com')
            ];
        })
    ]);
});
Route::get('/test-blog-create', function() {
    try {
        $blog = \App\Models\Blog::create([
            'title' => 'Test Blog',
            'slug' => 'test-blog-' . time(),
            'small_description' => 'Test description',
            'content' => 'Test content',
            'category_id' => 1, // Make sure category 1 exists!
            'is_active' => true,
            'status' => 'published'
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Blog created without image',
            'data' => $blog
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
});