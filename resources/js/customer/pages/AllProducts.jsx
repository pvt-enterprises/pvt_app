import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function AllProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/categories')
            ]);
            if (prodRes.data.success) setProducts(prodRes.data.data);
            if (catRes.data.success) setCategories(catRes.data.data);
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

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category_id === parseInt(selectedCategory));

    if (loading) return <div className="home-loading">Loading...</div>;

    return (
        <div className="home-page">
            <div className="page-breadcrumb">
                <Link to="/">Home</Link> → <span>All Products</span>
            </div>

            <section className="home-section">
                <div className="section-header">
                    <h2>All Products</h2>
                    <p>{products.length} products available for export</p>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    <button
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div className="product-card" key={product.id}>
                            <div className="product-card-image">
                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                            </div>
                            <div className="product-card-body">
                                <h3>{product.name}</h3>
                                <p className="product-brand">{product.brand_name}</p>
                                <p className="product-desc">
                                    {product.packaging_details?.substring(0, 80)}...
                                </p>
                                <Link to={`/products/${product.id}`} className="btn-details">
                                    View All Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default AllProducts;