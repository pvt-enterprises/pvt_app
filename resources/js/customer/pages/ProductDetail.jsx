import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            const [prodRes, settingsRes] = await Promise.all([
                axios.get(`/products/${id}`),
                axios.get('/settings'),
            ]);
            if (prodRes.data.success) setProduct(prodRes.data.data);
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

    if (loading) return <div className="pd-loading" style={{ backgroundColor: '#0c0d0c', color: '#699b65' }}>Loading...</div>;
    if (!product) return <div className="pd-loading" style={{ backgroundColor: '#0c0d0c', color: '#ff6b6b' }}>Product not found.</div>;

    return (
        <div className="pd-page" style={{ backgroundColor: settings?.color_five || '#0c0d0c' }}>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                settings={settings}
                onNavigate={(id) => {
                    setSidebarOpen(false);
                    navigate('/');
                    setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 400);
                }}
            />

            <Navbar settings={settings} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Hero */}
            <div className="pd-hero">
                <div className="pd-hero__bg" style={{ backgroundImage: `url(${getImageUrl(product.image)})` }} />
                <div className="pd-hero__overlay" />
                <div className="pd-hero__img-wrap">
                    <img src={getImageUrl(product.image)} alt={product.name} className="pd-hero__img"
                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} />
                </div>
            </div>

            {/* Detail card */}
            <div className="pd-body">
                <div className="pd-card" style={{ backgroundColor: settings?.color_seven || '#151616', borderColor: settings?.color_four || '#171819' }}>

                    <div className="pd-breadcrumb">
                        <Link to="/" style={{ color: settings?.color_one || '#a7a7a7' }}>Home</Link>
                        <span style={{ color: settings?.color_one || '#a7a7a7' }}> / </span>
                        <Link to="/products" style={{ color: settings?.color_one || '#a7a7a7' }}>Products</Link>
                        {product.category && (
                            <>
                                <span style={{ color: settings?.color_one || '#a7a7a7' }}> / </span>
                                <Link to={`/category/${product.category_id}`} style={{ color: settings?.color_one || '#a7a7a7' }}>
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <span style={{ color: settings?.color_one || '#a7a7a7' }}> / </span>
                        <span style={{ color: settings?.color_three || '#699b65' }}>{product.name}</span>
                    </div>

                    <h1 className="pd-title" style={{ color: '#ffffff' }}>{product.name}</h1>

                    <div className="pd-rows">
                        {product.brand_name && (
                            <div className="pd-row" style={{ borderBottomColor: settings?.color_four || '#2a2b2c' }}>
                                <span className="pd-label" style={{ color: settings?.color_one || '#a7a7a7' }}>Brand</span>
                                <span className="pd-value" style={{ color: '#ffffff' }}>{product.brand_name}</span>
                            </div>
                        )}
                        {product.category && (
                            <div className="pd-row" style={{ borderBottomColor: settings?.color_four || '#2a2b2c' }}>
                                <span className="pd-label" style={{ color: settings?.color_one || '#a7a7a7' }}>Category</span>
                                <span className="pd-value" style={{ color: '#ffffff' }}>{product.category.name}</span>
                            </div>
                        )}
                        {product.packaging_details && (
                            <div className="pd-row" style={{ borderBottomColor: settings?.color_four || '#2a2b2c' }}>
                                <span className="pd-label" style={{ color: settings?.color_one || '#a7a7a7' }}>Packaging</span>
                                <span className="pd-value" style={{ color: '#ffffff' }}>{product.packaging_details}</span>
                            </div>
                        )}
                        {product.price > 0 && (
                            <div className="pd-row" style={{ borderBottomColor: settings?.color_four || '#2a2b2c' }}>
                                <span className="pd-label" style={{ color: settings?.color_one || '#a7a7a7' }}>Price</span>
                                <span className="pd-value pd-price" style={{ color: settings?.color_three || '#699b65' }}>${product.price}</span>
                            </div>
                        )}
                        {product.export_charges && (
                            <div className="pd-row" style={{ borderBottomColor: settings?.color_four || '#2a2b2c' }}>
                                <span className="pd-label" style={{ color: settings?.color_one || '#a7a7a7' }}>Export Charges</span>
                                <span className="pd-value" style={{ color: '#ffffff' }}>${product.export_charges}</span>
                            </div>
                        )}
                    </div>

                    <div className="pd-actions">
                        {product.category && (
                            <Link to={`/category/${product.category_id}`} className="pd-btn-secondary"
                                style={{ borderColor: settings?.color_three || '#699b65', color: settings?.color_three || '#699b65' }}>
                                ← More in {product.category.name}
                            </Link>
                        )}
                        <Link to="/products" className="pd-btn-primary"
                            style={{ backgroundColor: settings?.color_three || '#699b65', color: settings?.color_five || '#0c0d0c' }}>
                            All Products
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
            <WhatsAppButton phone={settings?.whatsapp_number || settings?.contact_phone || '9496757243'} />
        </div>
    );
}

export default ProductDetail;