import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        brand_name: '',
        packaging_details: '',
        price: '',
        export_charges: '',
        category_id: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getApiBaseUrl = () => {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://127.0.0.1:8000/api'
            : `${window.location.origin}/api`;
    };

    useEffect(() => {
        fetchCategories();
        if (isEditMode) fetchProduct();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const url = `${getApiBaseUrl()}/categories`;
            console.log('Fetching categories from:', url); // ← check this URL in browser console
            console.log('Token:', token);                  // ← check token exists

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Categories:', response.data);     // ← check what comes back
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Categories error:', error.response?.status, error.response?.data);
        }
    };
    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${getApiBaseUrl()}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const product = response.data.data;
                setFormData({
                    name: product.name || '',
                    brand_name: product.brand_name || '',
                    packaging_details: product.packaging_details || '',
                    price: product.price || '',
                    export_charges: product.export_charges || '',
                    category_id: product.category_id || ''
                });
                if (product.image) {
                    setImagePreview(
                        product.image.startsWith('http')
                            ? product.image
                            : `/storage/${product.image}`
                    );
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image (JPEG, PNG, GIF, or WebP)');
                e.target.value = '';
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must not exceed 2MB');
                e.target.value = '';
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        

        try {
            const token = localStorage.getItem('auth_token');
            const formDataToSend = new FormData();

            formDataToSend.append('name', formData.name);
            formDataToSend.append('brand_name', formData.brand_name);
            formDataToSend.append('packaging_details', formData.packaging_details);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('export_charges', formData.export_charges || '');
            formDataToSend.append('category_id', formData.category_id);
            formDataToSend.append('is_active', 1);

            if (imageFile) formDataToSend.append('image', imageFile);

            let response;
            if (isEditMode) {
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(
                    `${getApiBaseUrl()}/products/${id}`,
                    formDataToSend,
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                );
            } else {
                response = await axios.post(
                    `${getApiBaseUrl()}/products`,
                    formDataToSend,
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                );
            }

            if (response.data.success) {
                alert(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
                navigate('/staff/products');
            }
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors) {
                    const errorMessages = Object.entries(errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('\n');
                    setError(`Validation failed:\n${errorMessages}`);
                } else {
                    setError(error.response.data.message || 'Validation failed');
                }
            } else {
                setError(error.response?.data?.message || 'Failed to save product');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
                <Link to="/staff/products" className="btn-back">← Back to List</Link>
            </div>

            {error && (
                <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">

                {/* Product Name */}
                <div className="form-group">
                    <label>Product Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g., Basmati Rice, Turmeric Powder"
                        required
                    />
                </div>

                {/* Brand Name */}
                <div className="form-group">
                    <label>Brand Name *</label>
                    <input
                        type="text"
                        name="brand_name"
                        value={formData.brand_name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g., Naturals, Organic India"
                        required
                    />
                </div>

                {/* Packaging Details */}
                <div className="form-group">
                    <label>Packaging Details *</label>
                    <textarea
                        name="packaging_details"
                        value={formData.packaging_details}
                        onChange={handleChange}
                        className="form-control"
                        rows={4}
                        placeholder="e.g., 25kg bags, vacuum sealed, available in 1kg / 5kg / 25kg packs"
                        required
                    />
                </div>

                {/* Category */}
                <div className="form-group">
                    <label>Category *</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price & Export Charges */}
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Product Price (USD) </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="form-group half-width">
                        <label>Export Charges (USD)</label>
                        <input
                            type="number"
                            name="export_charges"
                            value={formData.export_charges}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                        <small className="form-text">Optional — leave empty if not applicable</small>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="form-group">
                    <label>
                        Product Image (Optional)
                        {isEditMode && ' (Leave empty to keep current image)'}
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="form-control-file"
                    />
                    <small className="form-text">
                        Accepted: JPEG, PNG, GIF, WebP. Recommended: 500px × 500px. Max: 2MB
                    </small>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="image-preview-square">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}

                {/* Actions */}
                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-submit"
                    >
                        {loading ? 'Saving... ⏳' : isEditMode ? 'Update Product' : 'Create Product'}
                    </button>
                    <Link to="/staff/products" className="btn-cancel">Cancel</Link>
                </div>

            </form>
        </div>
    );
}

export default ProductForm;