import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingFormContent.css';
import { API_BASE_URL } from '../../config/api';

function BookingFormContent() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        product_interest: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const countries = [
        'United Kingdom', 'United States', 'India', 'Australia', 'UAE',
        'Canada', 'Germany', 'France', 'Singapore', 'South Africa',
        'Saudi Arabia', 'Nigeria', 'Kenya', 'Bangladesh', 'Pakistan',
        'Sri Lanka', 'Malaysia', 'Philippines', 'Indonesia', 'Other'
    ];

    const productInterests = [
        'Active Pharmaceutical Ingredients (APIs)',
        'Finished Dosage Forms',
        'Herbal & Nutraceuticals',
        'Veterinary Products',
        'Surgical & Medical Devices',
        'Cosmetics & Personal Care',
        'Other'
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/settings');
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const getOpeningHours = () => {
        if (!settings) return [];
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const hours = [];
        days.forEach(day => {
            const slots = settings.booking_schedule?.[day] || [];
            if (slots.length > 0) {
                const firstSlot = slots[0];
                const lastSlot = slots[slots.length - 1];
                hours.push({
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    time: `${formatTime(firstSlot)} - ${formatTime(lastSlot)}`
                });
            }
        });
        return hours;
    };

    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/enquiries', formData);
            if (response.data.success) {
                setMessage('Your enquiry has been submitted successfully! We will get back to you shortly.');
                setFormData({
                    name: '',
                    email: '',
                    country: '',
                    product_interest: '',
                    message: '',
                });
            }
        } catch (error) {
            console.error('Enquiry error:', error);
            setMessage('Failed to submit enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const groupHoursByPeriod = (hours) => {
        const weekdays = hours.filter(h => !['Sunday', 'Saturday'].includes(h.day));
        const weekend = hours.filter(h => ['Sunday', 'Saturday'].includes(h.day));
        return { weekdays, weekend };
    };

    const openingHours = getOpeningHours();
    const { weekdays, weekend } = groupHoursByPeriod(openingHours);

    return (
        <div className="booking-content-wrapper">
            <div className="booking-content-container">

                {/* Left Section — Enquiry Form */}
                <div className="booking-content-form-section">
                    <h1 className="booking-content-title">Product Enquiry</h1>
                    <p className="booking-content-subtitle">
                        Fill out the form below and our team will get back to you within 24 hours with pricing and availability.
                    </p>

                    {message && (
                        <div className={`booking-alert ${message.includes('success') ? 'booking-alert-success' : 'booking-alert-error'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="booking-content-form">

                        {/* Name */}
                        <div className="booking-form-group">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Full Name"
                                required
                                className="booking-form-input"
                            />
                        </div>

                        {/* Email */}
                        <div className="booking-form-group">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="Email Address"
                                required
                                className="booking-form-input"
                            />
                        </div>

                        {/* Country */}
                        <div className="booking-form-group">
                            <select
                                value={formData.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                className="booking-form-select booking-form-select-full"
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Product Interest */}
                        <div className="booking-form-group">
                            <select
                                value={formData.product_interest}
                                onChange={(e) => handleChange('product_interest', e.target.value)}
                                className="booking-form-select booking-form-select-full"
                                required
                            >
                                <option value="">Select Product Interest</option>
                                {productInterests.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        {/* Message */}
                        <div className="booking-form-group">
                            <textarea
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                placeholder="Describe your requirements (quantity, specifications, destination, etc.)"
                                rows="4"
                                className="booking-form-textarea"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="booking-btn-book">
                            {loading ? 'Submitting...' : 'SEND ENQUIRY'}
                        </button>

                    </form>
                </div>

                {/* Right Section — Contact Info (unchanged) */}
                <div className="booking-content-info-section">
                    <h2 className="booking-info-title">Contact Us</h2>

                    <div className="booking-info-item">
                        <h3 className="booking-info-label">Booking Request</h3>
                        <a href={`tel:${settings?.contact_phone}`} className="booking-info-value">
                            {settings?.contact_phone || '+44 787 8277198'}
                        </a>
                    </div>

                    <div className="booking-info-item">
                        <h3 className="booking-info-label">Location</h3>
                        <p className="booking-info-value">
                            {settings?.contact_address || '169 West Rd, Newcastle upon Tyne NE15 6PQ'}
                        </p>
                    </div>

                    <div className="booking-info-item">
                        <h3 className="booking-info-label">Opening Hours</h3>
                        {weekdays.length > 0 && weekdays.every(w => w.time === weekdays[0].time) ? (
                            <div className="booking-hours-group">
                                <p className="booking-hours-days">Monday - Friday</p>
                                <p className="booking-hours-time">{weekdays[0].time}</p>
                            </div>
                        ) : (
                            weekdays.map((hour, idx) => (
                                <div key={idx} className="booking-hours-group">
                                    <p className="booking-hours-days">{hour.day}</p>
                                    <p className="booking-hours-time">{hour.time}</p>
                                </div>
                            ))
                        )}
                        {weekend.map((hour, idx) => (
                            <div key={idx} className="booking-hours-group">
                                <p className="booking-hours-days">{hour.day}</p>
                                <p className="booking-hours-time">{hour.time}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BookingFormContent;