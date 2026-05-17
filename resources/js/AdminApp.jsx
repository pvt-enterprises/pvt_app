import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminLayout from './components/Layout/AdminLayout';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import HeroBanner from './components/HeroBanner/HeroBanner';
import PageList from './components/Pages/PageList';
import PageForm from './components/Pages/PageForm';
import TopMenuList from './components/TopMenu/TopMenuList';
import TopMenuForm from './components/TopMenu/TopMenuForm';
import FooterLinksList from './components/FooterLinks/FooterLinksList';
import FooterLinksForm from './components/FooterLinks/FooterLinksForm';
import GeneralSettings from './components/Settings/GeneralSettings';
import DomainSettings from './components/DomainSettings/DomainSettings';
import CategoryList from './components/Categories/CategoryList';
import CategoryForm from './components/Categories/CategoryForm';
import { getApiUrl } from './config/api';

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('auth_token')
    );
    const [username, setUsername] = useState('Super Admin');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserDetails();
        }
    }, [isAuthenticated]);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(getApiUrl('me'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            let userData = null;
            if (response.data.success && response.data.data) {
                userData = response.data.data;
            } else if (response.data.user) {
                userData = response.data.user;
            } else if (response.data.name) {
                userData = response.data;
            }
            
            if (userData) {
                setUsername(userData.name || userData.username || 'Super Admin');
                setUserEmail(userData.email || '');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleLogin = (token, userData) => {
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
        
        if (userData) {
            setUsername(userData.name || userData.username || 'Super Admin');
            setUserEmail(userData.email || '');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUsername('Super Admin');
        setUserEmail('');
    };

    return (
        <Routes>
            {/* LOGIN ROUTE at /login */}
            <Route 
                path="/login" 
                element={
                    isAuthenticated ? 
                    <Navigate to="/staff/dashboard" replace /> : 
                    <Login onLogin={handleLogin} />
                } 
            />
            
            {/* PROTECTED STAFF ROUTES */}
            <Route 
                path="/staff/*" 
                element={
                    isAuthenticated ? (
                        <AdminLayout onLogout={handleLogout} username={username} userEmail={userEmail}>
                            <Routes>
                                <Route path="dashboard" element={<Dashboard username={username} />} />
                                
                                <Route path="domain-settings" element={<DomainSettings />} />
                                
                                <Route path="top-menu" element={<TopMenuList />} />
                                <Route path="top-menu/create" element={<TopMenuForm />} />
                                <Route path="top-menu/:id/edit" element={<TopMenuForm />} />
                                
                                <Route path="hero-banners" element={<HeroBanner />} />
                                
                                <Route path="pages" element={<PageList />} />
                                <Route path="pages/create" element={<PageForm />} />
                                <Route path="pages/:id/edit" element={<PageForm />} />
                                
                                <Route path="categories" element={<CategoryList />} />
                                <Route path="categories/create" element={<CategoryForm />} />
                                <Route path="categories/:id/edit" element={<CategoryForm />} />
                                
                                <Route path="products" element={<ProductList />} />
                                <Route path="products/create" element={<ProductForm />} />
                                <Route path="products/:id/edit" element={<ProductForm />} />
                                
                                <Route path="settings" element={<GeneralSettings />} />
                                
                                <Route path="footer-links" element={<FooterLinksList />} />
                                <Route path="footer-links/create" element={<FooterLinksForm />} />
                                <Route path="footer-links/:id/edit" element={<FooterLinksForm />} />
                                
                                {/* Redirect /staff to /staff/dashboard */}
                                <Route path="/" element={<Navigate to="dashboard" replace />} />
                                
                                {/* Catch-all for unknown staff routes */}
                                <Route path="*" element={<Navigate to="dashboard" replace />} />
                            </Routes>
                        </AdminLayout>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } 
            />
        </Routes>
    );
}

export default AdminApp;