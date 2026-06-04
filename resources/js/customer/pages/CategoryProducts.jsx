import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './CategoryProducts.css';

function CategoryProducts() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            const [catRes, prodRes, settingsRes] = await Promise.all([
                axios.get(`/categories/${id}`),
                axios.get('/products'),
                axios.get('/settings'),
            ]);
            if (catRes.data.success) setCategory(catRes.data.data);
            if (prodRes.data.success) setProducts(prodRes.data.data.filter(p => p.category_id === parseInt(id)));
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

    if (loading) return <div className="cp-loading" style={{ backgroundColor: '#0c0d0c', color: '#699b65' }}>Loading...</div>;

    return (
        <div className="cp-page" style={{ backgroundColor: settings?.color_five || '#0c0d0c' }}>

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
            <div className="cp-hero">
                {category?.image && (
                    <div className="cp-hero__bg" style={{ backgroundImage: `url(${getImageUrl(category.image)})` }} />
                )}
                <div className="cp-hero__overlay" />
                <div className="cp-hero__content">
                    <h1 className="cp-hero__title" style={{ color: '#ffffff' }}>{category?.name}</h1>
                    {category?.description && (
                        <p className="cp-hero__desc" style={{ color: 'rgba(255,255,255,0.75)' }}>{category.description}</p>
                    )}
                </div>
            </div>

            {/* Products */}
            <div className="cp-body">
                <div className="cp-section-header">
                    <span className="cp-eyebrow" style={{ color: settings?.color_three || '#699b65', borderColor: settings?.color_three || '#699b65' }}>
                        {category?.name}
                    </span>
                    <h2 style={{ color: '#ffffff' }}>Products in this Category</h2>
                </div>

                {products.length === 0 ? (
                    <div className="cp-empty">
                        <p style={{ color: settings?.color_one || '#a7a7a7' }}>No products found in this category yet.</p>
                        <Link to="/products" className="cp-btn-back"
                            style={{ borderColor: settings?.color_three || '#699b65', color: settings?.color_three || '#699b65' }}>
                            ← All Products
                        </Link>
                    </div>
                ) : (
                    <div className="cp-grid">
                        {products.map(product => (
                            <div className="cp-card" key={product.id}
                                style={{ backgroundColor: settings?.color_seven || '#151616', borderColor: settings?.color_four || '#171819' }}>
                                <div className="cp-card__image" style={{ backgroundColor: settings?.color_six || '#1a1b1c' }}>
                                    <img src={getImageUrl(product.image)} alt={product.name}
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} />
                                </div>
                                <div className="cp-card__body">
                                    <h3 style={{ color: settings?.color_three || '#ffffff' }}>{product.name}</h3>
                                    <p className="cp-card__brand" style={{ color: settings?.main_color || '#e4e590' }}>{product.brand_name}</p>
                                    <p className="cp-card__desc" style={{ color: settings?.color_one || '#a7a7a7' }}>
                                        {product.packaging_details?.substring(0, 80)}{product.packaging_details?.length > 80 ? '...' : ''}
                                    </p>
                                    <Link to={`/products/${product.id}`} className="cp-card__btn"
                                        style={{ backgroundColor: settings?.color_three || '#699b65', color: settings?.color_five || '#0c0d0c' }}>
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