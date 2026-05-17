import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CategoriesSection({ id }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/categories')
            .then(res => {
                if (res.data.success) setCategories(res.data.data);
            })
            .catch(err => console.error('Error fetching categories:', err))
            .finally(() => setLoading(false));
    }, []);

    const getImageUrl = (image) => {
        if (!image) return '/placeholder-image.jpg';
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    if (loading) return <div className="section-loading">Loading categories...</div>;
    if (categories.length === 0) return null;

    return (
        <section id={id} className="home-categories-section">
            <div className="home-section-inner">
                <div className="home-section-header">
                    <h2>Our Product Categories</h2>
                    <p>Explore our wide range of export-quality product categories</p>
                </div>

                <div className="home-categories-grid">
                    {categories.map(category => (
                        <div className="home-category-card" key={category.id}>
                            <div className="home-category-card__image">
                                <img
                                    src={getImageUrl(category.image)}
                                    alt={category.name}
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                            </div>
                            <div className="home-category-card__body">
                                <h3>{category.name}</h3>
                                <p>{category.description || 'Quality products for global export.'}</p>
                                <Link
                                    to={`/categories/${category.id}/products`}
                                    className="home-btn-explore"
                                >
                                    Explore Now →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoriesSection;