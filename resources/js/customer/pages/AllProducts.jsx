import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import './AllProducts.css';

function AllProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, settingsRes] = await Promise.all([
                axios.get('/products'),
                axios.get('/settings'),
            ]);
            if (prodRes.data.success) setProducts(prodRes.data.data);
            setSettings(settingsRes.data.data || settingsRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return '/placeholder-image.jpg';
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    const getHeroImage = () => {
        const path = settings?.default_image;
        if (!path) return null;
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    if (loading) return (
        <div className="ap-loading" style={{ backgroundColor: settings?.color_five || '#0c0d0c', color: settings?.color_three || '#699b65' }}>
            Loading...
        </div>
    );

    return (
        <div className="ap-page" style={{ backgroundColor: settings?.color_five || '#0c0d0c' }}>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                settings={settings}
                onNavigate={(id) => {
                    setSidebarOpen(false);
                    navigate('/');
                    setTimeout(() => {
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                }}
            />

            <Navbar
                settings={settings}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* ── Hero ──────────────────────────────────────── */}
            <div className="ap-hero">
                {getHeroImage() && (
                    <div
                        className="ap-hero__bg"
                        style={{ backgroundImage: `url(${getHeroImage()})` }}
                    />
                )}
                <div className="ap-hero__overlay" />
                <div className="ap-hero__content">
                    <span
                        className="ap-eyebrow"
                        style={{ borderColor: settings?.color_three || '#699b65', color: settings?.color_three || '#699b65' }}
                    >
                        Our Products
                    </span>
                    <h1 className="ap-hero__title">All Products</h1>
                    <p className="ap-hero__sub">
                        Explore our full range of export-ready products
                    </p>
                </div>
            </div>

            {/* ── Grid ──────────────────────────────────────── */}
            <div className="ap-body">
                {products.length === 0 ? (
                    <div className="ap-empty">
                        <p style={{ color: settings?.color_one || '#a7a7a7' }}>No products available yet.</p>
                        <Link to="/" style={{ color: settings?.color_three || '#699b65' }}>← Back to Home</Link>
                    </div>
                ) : (
                    <div className="ap-grid">
                        {products.map(product => (
                            <div
                                className="ap-card"
                                key={product.id}
                                style={{
                                    backgroundColor: settings?.color_seven || '#151616',
                                    borderColor: settings?.color_four || '#171819',
                                }}
                            >
                                <div className="ap-card__image" style={{ backgroundColor: settings?.color_six || '#1a1b1c' }}>
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    />
                                </div>
                                <div className="ap-card__body">
                                    <h3 style={{ color: settings?.color_three || '#ffffff' }}>{product.name}</h3>
                                    <p className="ap-card__brand" style={{ color: settings?.main_color || '#e4e590' }}>{product.brand_name}</p>
                                    <p className="ap-card__desc" style={{ color: settings?.color_one || '#a7a7a7' }}>
                                        {product.packaging_details?.substring(0, 80)}
                                        {product.packaging_details?.length > 80 ? '...' : ''}
                                    </p>
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="ap-card__btn"
                                        style={{ backgroundColor: settings?.color_three || '#699b65', color: settings?.color_five || '#0c0d0c' }}
                                    >
                                        View All Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
            <WhatsAppButton phone={s?.whatsapp_number || s?.contact_phone || '9496757243'} />
        </div>
    );
}

export default AllProducts;