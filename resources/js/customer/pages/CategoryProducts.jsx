import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategoryProducts.css';

function CategoryProducts() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [catRes, prodRes, settingsRes] = await Promise.all([
                axios.get(`/categories/${id}`),
                axios.get('/products'),
                axios.get('/settings'),
            ]);
            if (catRes.data.success) setCategory(catRes.data.data);
            if (prodRes.data.success) {
                setProducts(
                    prodRes.data.data.filter(p => p.category_id === parseInt(id))
                );
            }
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

    const getLogoUrl = () => {
        const path = settings?.website_logo || settings?.logo;
        if (!path) return null;
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    if (loading) return (
        <div
            className="cp-loading"
            style={{ backgroundColor: settings?.color_five || '#0c0d0c',
                     color: settings?.color_three || '#699b65' }}
        >
            Loading...
        </div>
    );

    return (
        <div
            className="cp-page"
            style={{ backgroundColor: settings?.color_five || '#0c0d0c' }}
        >
            {/* ── Navbar ───────────────────────────────────────── */}
            <nav
                className="cp-navbar"
                style={{ backgroundColor: settings?.white_color || '#ffffff' }}
            >
                <div className="cp-navbar__inner">
                    <button className="cp-back-btn" onClick={() => navigate(-1)}>
                        <span
                            className="cp-back-arrow"
                            style={{ color: settings?.color_three || '#699b65' }}
                        >
                            ←
                        </span>
                    </button>

                    <div className="cp-navbar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        {getLogoUrl() ? (
                            <img src={getLogoUrl()} alt={settings?.site_name || 'Logo'} />
                        ) : (
                            <span style={{ color: settings?.black_color || '#000', fontWeight: 600, fontSize: '1.1rem' }}>
                                {settings?.site_name || 'PVT Enterprises'}
                            </span>
                        )}
                    </div>

                    <Link
                        to="/"
                        className="cp-home-link"
                        style={{ color: settings?.black_color || '#1a1a1a' }}
                    >
                        Home
                    </Link>
                </div>
            </nav>

            {/* ── Hero banner ──────────────────────────────────── */}
            <div className="cp-hero">
                {/* Blurred background image */}
                {category?.image && (
                    <div
                        className="cp-hero__bg"
                        style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}
                    />
                )}
                <div
                    className="cp-hero__overlay"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                />
                <div className="cp-hero__content">
                    <h1
                        className="cp-hero__title"
                        style={{ color: '#ffffff' }}
                    >
                        {category?.name}
                    </h1>
                    {category?.description && (
                        <p
                            className="cp-hero__desc"
                            style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Products grid ────────────────────────────────── */}
            <div className="cp-body">
                <div className="cp-section-header">
                    <span
                        className="cp-eyebrow"
                        style={{ color: settings?.color_three || '#699b65' }}
                    >
                        {category?.name}
                    </span>
                    <h2 style={{ color: '#ffffff' }}>
                        Products in this Category
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="cp-empty">
                        <p style={{ color: settings?.color_one || '#a7a7a7' }}>
                            No products found in this category yet.
                        </p>
                        <Link
                            to="/"
                            className="cp-btn-back"
                            style={{
                                borderColor: settings?.color_three || '#699b65',
                                color: settings?.color_three || '#699b65',
                            }}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="cp-grid">
                        {products.map(product => (
                            <div
                                className="cp-card"
                                key={product.id}
                                style={{
                                    backgroundColor: settings?.color_seven || '#151616',
                                    borderColor: settings?.color_four || '#171819',
                                }}
                            >
                                <div
                                    className="cp-card__image"
                                    style={{ backgroundColor: settings?.color_six || '#1a1b1c' }}
                                >
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    />
                                </div>
                                <div className="cp-card__body">
                                    <h3 style={{ color: settings?.color_three || '#ffffff' }}>
                                        {product.name}
                                    </h3>
                                    <p
                                        className="cp-card__brand"
                                        style={{ color: settings?.main_color || '#e4e590' }}
                                    >
                                        {product.brand_name}
                                    </p>
                                    <p
                                        className="cp-card__desc"
                                        style={{ color: settings?.color_one || '#a7a7a7' }}
                                    >
                                        {product.packaging_details?.substring(0, 80)}
                                        {product.packaging_details?.length > 80 ? '...' : ''}
                                    </p>
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="cp-card__btn"
                                        style={{
                                            backgroundColor: settings?.color_three || '#699b65',
                                            color: settings?.color_five || '#0c0d0c',
                                        }}
                                    >
                                        View All Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryProducts;