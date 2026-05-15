import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Categories.css';

function CategoryForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('You must be logged in to access this page.');
            setTimeout(() => navigate('/staff/login'), 2000);
        }
    }, [navigate]);

    useEffect(() => {
        if (isEditMode) fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return setError('Authentication required');

            const response = await axios.get(`/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const category = response.data.data;
                setFormData({
                    name: category.name,
                    description: category.description || ''
                });
                if (category.image) {
                    setImagePreview(
                        category.image.startsWith('http')
                            ? category.image
                            : `/storage/${category.image}`
                    );
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
                setTimeout(() => navigate('/staff/login'), 2000);
            } else {
                setError('Failed to load category');
            }
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

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Authentication required. Please log in.');
            setLoading(false);
            setTimeout(() => navigate('/staff/login'), 2000);
            return;
        }

        if (!isEditMode && !imageFile) {
            setError('Product image is required');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('is_active', '1');
            if (imageFile) formDataToSend.append('image', imageFile);

            let response;

            if (isEditMode) {
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(`/categories/${id}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.post(`/categories`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (response.data.success) {
                alert(isEditMode ? 'Category updated successfully!' : 'Category created successfully!');
                navigate('/staff/categories');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setTimeout(() => navigate('/staff/login'), 2000);
            } else if (error.response?.status === 422) {
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
                setError(error.response?.data?.message || error.message || 'Failed to save. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Product Category' : 'Add Product Category'}</h1>
                <Link to="/staff/categories" className="btn-back">← Back to List</Link>
            </div>

            {error && (
                <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="category-form">

                {/* Product Name */}
                <div className="form-group">
                    <label>Product Category Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g., Spices, Grains, Seafood"
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Briefly describe this product category..."
                        rows={4}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                    <label>
                        Category Image *
                        {isEditMode && ' (Leave empty to keep current image)'}
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="form-control-file"
                        required={!isEditMode}
                    />
                    <small className="form-text">
                        Accepted: JPEG, PNG, GIF, WebP. Recommended: 285px × 336px. Max: 2MB
                    </small>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="image-preview-rectangle">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}

                {/* Actions */}
                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading || (!isEditMode && !imageFile)}
                        className="btn-submit"
                    >
                        {loading ? (
                            <><span>Saving...</span><span style={{ marginLeft: '10px' }}>⏳</span></>
                        ) : (
                            isEditMode ? 'Update Category' : 'Create Category'
                        )}
                    </button>
                    <Link to="/staff/categories" className="btn-cancel">Cancel</Link>
                </div>

            </form>
        </div>
    );
}

export default CategoryForm;