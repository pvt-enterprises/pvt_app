import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PageView from './pages/PageView';
import BookingPage from './pages/BookingPage';
import ContactUsPage from './pages/ContactUsPage';
// ✅ ADD THESE 3 IMPORTS
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import AllProducts from './pages/AllProducts';

import './styles/customer.css';

function CustomerApp() {
    return (
        <>
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/page/:slug" element={<PageView />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/contact" element={<ContactUsPage />} />

                {/* ✅ ADD THESE 3 ROUTES */}
                <Route path="/categories/:id/products" element={<CategoryProducts />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products" element={<AllProducts />} />
            </Routes>
        </>
    );
}

export default CustomerApp;