import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductsSection({ id }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/products')
            .then(res => {
                if (res.data.success) setProducts(res.data.data);
            })
            .catch(err => console.error('Error fetching products:', err))
            .finally(() => setLoading(false));
    }, []);

    const getImageUrl = (image) => {
        if (!image) return '/placeholder-image.jpg';
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    if (loading) return <div className="section-loading">Loading products...</div>;
    if (products.length === 0) return null;

    return (
        <section id={id} className="home-products-section">
            <div className="home-section-inner">
                <div className="home-section-header">
                    <h2>Featured Products</h2>
                    <p>Discover our top export products</p>
                </div>

                <div className="home-products-grid">
                    {products.slice(0, 6).map(product => (
                        <div className="home-product-card" key={product.id}>
                            <div className="home-product-card__image">
                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                            </div>
                            <div className="home-product-card__body">
                                <h3>{product.name}</h3>
                                <p className="home-product-brand">{product.brand_name}</p>
                                <p className="home-product-desc">
                                    {product.packaging_details?.substring(0, 80)}
                                    {product.packaging_details?.length > 80 ? '...' : ''}
                                </p>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="home-btn-details"
                                >
                                    View All Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All — only if more than 6 products */}
                {products.length > 6 && (
                    <div className="home-view-all-wrapper">
                        <Link to="/products" className="home-btn-view-all">
                            View All Products ({products.length})
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductsSection;