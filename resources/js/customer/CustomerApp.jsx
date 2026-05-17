import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryMenu from './pages/CategoryMenu';
import PageView from './pages/PageView';
import MainMenu from './pages/MainMenu';
import CategoryDetail from './pages/CategoryDetail';
import OurMenus from './pages/OurMenus';
import BookingPage from './pages/BookingPage';
import ContactUsPage from './pages/ContactUsPage';
import AboutPage from './pages/AboutPage';
import PopupAd from './components/PopupAd';
import OurChefsPage from './pages/OurChefsPage';

// ✅ ADD THESE 3 IMPORTS
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import AllProducts from './pages/AllProducts';

import './styles/customer.css';

function CustomerApp() {
    return (
        <>
            <PopupAd />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu/:categoryId" element={<CategoryMenu />} />
                <Route path="/page/:slug" element={<PageView />} />
                <Route path="/our-menu" element={<MainMenu />} />
                <Route path="/menu/category/:categoryId" element={<CategoryDetail />} />
                <Route path="/our-menus" element={<OurMenus />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/our-chefs" element={<OurChefsPage />} />

                {/* ✅ ADD THESE 3 ROUTES */}
                <Route path="/categories/:id/products" element={<CategoryProducts />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products" element={<AllProducts />} />
            </Routes>
        </>
    );
}

export default CustomerApp;