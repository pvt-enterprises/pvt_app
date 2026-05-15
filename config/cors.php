<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:8000',  // ✅ your local
        'http://localhost:5173',  // ✅ Vite default
        'http://localhost:3000',  // ✅ just in case
        'https://pvtapp-production-7420.up.railway.app', // ✅ your live frontend
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];