import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function CategoryProducts() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                axios.get(`/api/categories/${id}`),
                axios.get('/api/products')
            ]);
            if (catRes.data.success) setCategory(catRes.data.data);
            if (prodRes.data.success) {
                // Filter products by category
                const filtered = prodRes.data.data.filter(
                    p => p.category_id === parseInt(id)
                );
                setProducts(filtered);
            }
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

    if (loading) return <div className="home-loading">Loading...</div>;

    return (
        <div className="home-page">
            <div className="page-breadcrumb">
                <Link to="/">Home</Link> → <span>{category?.name}</span>
            </div>

            <section className="home-section">
                <div className="section-header">
                    <h2>{category?.name}</h2>
                    <p>{category?.description}</p>
                </div>

                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products found in this category yet.</p>
                        <Link to="/" className="btn-explore">← Back to Home</Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
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
                )}
            </section>
        </div>
    );
}

export default CategoryProducts;