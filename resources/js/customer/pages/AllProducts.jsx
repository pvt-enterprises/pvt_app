import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
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

    const s = settings;
    const bg      = s?.color_five  || '#0c0d0c';
    const accent  = s?.color_three || '#699b65';
    const cardBg  = s?.color_seven || '#151616';
    const border  = s?.color_four  || '#2a2b2c';
    const muted   = s?.color_one   || '#a7a7a7';

    if (loading) return <div className="pd-loading" style={{ backgroundColor: bg, color: accent }}>Loading...</div>;
    if (!product) return <div className="pd-loading" style={{ backgroundColor: bg, color: '#ff6b6b' }}>Product not found.</div>;

    return (
        <div className="pd-page" style={{ backgroundColor: bg }}>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                settings={settings}
                onNavigate={(secId) => {
                    setSidebarOpen(false);
                    navigate('/');
                    setTimeout(() => document.getElementById(secId)?.scrollIntoView({ behavior: 'smooth' }), 400);
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
                <div className="pd-card" style={{ backgroundColor: cardBg, borderColor: border }}>

                    <div className="pd-breadcrumb">
                        <Link to="/" style={{ color: muted }}>Home</Link>
                        <span style={{ color: muted }}> / </span>
                        <Link to="/products" style={{ color: muted }}>Products</Link>
                        {product.category && (
                            <>
                                <span style={{ color: muted }}> / </span>
                                <Link to={`/category/${product.category_id}`} style={{ color: muted }}>{product.category.name}</Link>
                            </>
                        )}
                        <span style={{ color: muted }}> / </span>
                        <span style={{ color: accent }}>{product.name}</span>
                    </div>

                    <h1 className="pd-title" style={{ color: '#ffffff' }}>{product.name}</h1>

                    <div className="pd-rows">
                        {[
                            { label: 'Brand', value: product.brand_name },
                            { label: 'Category', value: product.category?.name },
                            { label: 'Packaging', value: product.packaging_details },
                            { label: 'Price', value: product.price > 0 ? `$${product.price}` : null, price: true },
                            { label: 'Export Charges', value: product.export_charges ? `$${product.export_charges}` : null },
                        ].filter(r => r.value).map((row, i) => (
                            <div className="pd-row" key={i} style={{ borderBottomColor: border }}>
                                <span className="pd-label" style={{ color: muted }}>{row.label}</span>
                                <span className="pd-value" style={{ color: row.price ? accent : '#ffffff', fontSize: row.price ? '1.3rem' : undefined, fontWeight: row.price ? 700 : undefined }}>
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pd-actions">
                        {product.category && (
                            <Link to={`/category/${product.category_id}`} className="pd-btn-secondary"
                                style={{ borderColor: accent, color: accent }}>
                                ← More in {product.category.name}
                            </Link>
                        )}
                        <Link to="/products" className="pd-btn-primary"
                            style={{ backgroundColor: accent, color: bg }}>
                            All Products
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ProductDetail;