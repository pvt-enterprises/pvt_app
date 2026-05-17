import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/products/${id}`);
            if (response.data.success) setProduct(response.data.data);
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
    if (!product) return <div className="home-loading">Product not found.</div>;

    return (
        <div className="product-detail-page">
            <div className="page-breadcrumb">
                <Link to="/">Home</Link> →{' '}
                {product.category && (
                    <><Link to={`/categories/${product.category_id}/products`}>
                        {product.category.name}
                    </Link> → </>
                )}
                <span>{product.name}</span>
            </div>

            <div className="product-detail-container">
                {/* Image */}
                <div className="product-detail-image">
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                    />
                </div>

                {/* Details */}
                <div className="product-detail-info">
                    <h1>{product.name}</h1>

                    {product.brand_name && (
                        <div className="detail-row">
                            <span className="detail-label">Brand</span>
                            <span className="detail-value">{product.brand_name}</span>
                        </div>
                    )}

                    {product.category && (
                        <div className="detail-row">
                            <span className="detail-label">Category</span>
                            <span className="detail-value">{product.category.name}</span>
                        </div>
                    )}

                    {product.packaging_details && (
                        <div className="detail-row">
                            <span className="detail-label">Packaging</span>
                            <span className="detail-value">{product.packaging_details}</span>
                        </div>
                    )}

                    {product.price > 0 && (
                        <div className="detail-row">
                            <span className="detail-label">Price</span>
                            <span className="detail-value price">${product.price}</span>
                        </div>
                    )}

                    {product.export_charges && (
                        <div className="detail-row">
                            <span className="detail-label">Export Charges</span>
                            <span className="detail-value">${product.export_charges}</span>
                        </div>
                    )}

                    <div className="detail-actions">
                        <Link
                            to={`/categories/${product.category_id}/products`}
                            className="btn-explore"
                        >
                            ← More in {product.category?.name}
                        </Link>
                        <Link to="/" className="btn-details">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;