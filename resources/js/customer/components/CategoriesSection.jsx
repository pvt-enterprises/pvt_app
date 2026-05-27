import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CategoriesSection.css';

function CategoriesSection({ id }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios.get('/categories')
            .then(res => {
                if (res.data.success) setCategories(res.data.data);
            })
            .catch(err => console.error('Error fetching categories:', err))
            .finally(() => setLoading(false));

        axios.get('/settings')
            .then(res => {
                const data = res.data.data || res.data;
                setSettings(data);
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const getImageUrl = (image) => {
        if (!image) return '/placeholder-image.jpg';
        return image.startsWith('http') ? image : `/storage/${image}`;
    };

    if (loading) return (
        <div className="section-loading"
            style={{ background: settings?.color_six || '#1a1b1c',
                     color: settings?.color_one || '#a7a7a7' }}>
            Loading categories...
        </div>
    );
    if (categories.length === 0) return null;

    return (
        <section
            id={id}
            className="home-categories-section"
            style={{ backgroundColor: settings?.color_six || '#1a1b1c' }}
        >
            <div className="home-section-inner">

                <div className="home-section-header">
                    <span
                        className="home-section-eyebrow"
                        style={{ color: settings?.color_three || '#699b65' }}
                    >
                        What We Offer
                    </span>
                    <h2 style={{ color: settings?.heading_color || '#ffffff' }}>
                        Our Product Lines
                    </h2>
                    <p style={{ color: settings?.color_one || '#a7a7a7' }}>
                        Explore our wide range of export-quality product categories
                    </p>
                </div>

                <div className="home-categories-grid">
                    {categories.map(category => (
                        <div
                            className="home-category-card"
                            key={category.id}
                            style={{
                                backgroundColor: settings?.color_seven || '#151616',
                                borderColor: settings?.color_five || '#0c0d0c',
                            }}
                        >
                            <div className="home-category-card__image">
                                <img
                                    src={getImageUrl(category.image)}
                                    alt={category.name}
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                            </div>
                            <div className="home-category-card__body">
                                <h3 style={{ color: settings?.heading_color || '#ffffff' }}>
                                    {category.name}
                                </h3>
                                <p style={{ color: settings?.text_color || '#a7a7a7' }}>
                                    {category.description || 'Quality products for global export.'}
                                </p>
                                <Link
                                    to={`/categories/${category.id}/products`}
                                    className="home-btn-explore"
                                    style={{ color: settings?.color_three || '#699b65' }}
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