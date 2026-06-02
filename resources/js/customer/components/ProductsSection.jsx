import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductsSection.css';

function ProductsSection({ id }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios.get('/products')
            .then(res => {
                if (res.data.success) setProducts(res.data.data);
            })
            .catch(err => console.error('Error fetching products:', err))
            .finally(() => setLoading(false));

        axios.get('/settings')
            .then(res => setSettings(res.data.data || res.data))
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const getImageUrl = (image) => {
        if (!image) return '/placeholder-image.jpg';
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    if (loading) return (
        <div className="section-loading"
            style={{ background: settings?.color_five || '#0c0d0c',
                     color: settings?.color_one || '#a7a7a7' }}>
            Loading products...
        </div>
    );
    if (products.length === 0) return null;

    return (
        <section
            id={id}
            className="home-products-section"
            style={{ backgroundColor: settings?.white_color || '#0c0d0c' }}
        >
            <div className="home-section-inner">

                <div className="home-section-header">
                    <span
                        className="home-section-eyebrow"
                        style={{ color: settings?.main_color || '#699b65' }}
                    >
                        Top Picks
                    </span>
                    <h2 style={{ color: settings?.main_color || '#ffffff' }}>
                        Featured Products
                    </h2>
                    <p style={{ color: settings?.color_two || '#a7a7a7' }}>
                        Discover our top export products
                    </p>
                </div>

                <div className="home-products-grid">
                    {products.slice(0, 6).map(product => (
                        <div
                            className="home-product-card"
                            key={product.id}
                            style={{
                                backgroundColor: settings?.color_five || '#151616',
                                borderColor: settings?.color_five || '#171819',
                            }}
                        >
                            <div
                                className="home-product-card__image"
                                style={{ backgroundColor: settings?.color_five || '#1a1b1c' }}
                            >
                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                            </div>
                            <div className="home-product-card__body">
                                <h3 style={{ color: settings?.color_three || '#ffffff' }}>
                                    {product.name}
                                </h3>
                                <p
                                    className="home-product-brand"
                                    style={{ color: settings?.color_three || '#e4e590' }}
                                >
                                    {product.brand_name}
                                </p>
                                <p
                                    className="home-product-desc"
                                    style={{ color: settings?.color_two || '#a7a7a7' }}
                                >
                                    {product.packaging_details?.substring(0, 80)}
                                    {product.packaging_details?.length > 80 ? '...' : ''}
                                </p>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="home-btn-details"
                                    style={{
                                        backgroundColor: settings?.color_six || '#699b65',
                                        color: settings?.main_color || '#0e0d0b',
                                    }}
                                >
                                    View All Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length > 6 && (
                    <div className="home-view-all-wrapper">
                        <Link
                            to="/products"
                            className="home-btn-view-all"
                            style={{
                                color: settings?.color_six || '#ffffff',
                                borderColor: settings?.color_six || '#699b65',
                            }}
                        >
                            View All Products ({products.length})
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}

export default ProductsSection;