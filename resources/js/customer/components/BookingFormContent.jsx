import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingFormContent.css';

function BookingFormContent() {
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', country: '', product_interest: '', message: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const countries = [
        'United Kingdom','United States','India','Australia','UAE','Canada',
        'Germany','France','Singapore','South Africa','Saudi Arabia','Nigeria',
        'Kenya','Bangladesh','Pakistan','Sri Lanka','Malaysia','Philippines',
        'Indonesia','Other'
    ];

    const productInterests = [
        'Active Pharmaceutical Ingredients (APIs)','Finished Dosage Forms',
        'Herbal & Nutraceuticals','Veterinary Products',
        'Surgical & Medical Devices','Cosmetics & Personal Care','Other'
    ];

    useEffect(() => {
        axios.get('/settings')
            .then(res => setSettings(res.data.data || res.data))
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const getOpeningHours = () => {
        if (!settings) return null;
        const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        const active = [];
        days.forEach(day => {
            const slots = settings.booking_schedule?.[day] || [];
            if (slots.length > 0) {
                active.push({
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    time: `${formatTime(slots[0])} – ${formatTime(slots[slots.length - 1])}`
                });
            }
        });
        if (active.length === 0) return null;
        const allSame = active.every(h => h.time === active[0].time);
        if (allSame && active.length > 1)
            return `${active[0].day} – ${active[active.length - 1].day}, ${active[0].time}`;
        return active.map(h => `${h.day}: ${h.time}`).join(' | ');
    };

    const formatTime = (time24) => {
        const [h, m] = time24.split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.post('/enquiries', formData);
            if (res.data.success) {
                setMessage('Enquiry submitted successfully! We will get back to you shortly.');
                setFormData({ name: '', email: '', country: '', product_interest: '', message: '' });
            }
        } catch {
            setMessage('Failed to submit enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openingHours = getOpeningHours();

    const s = settings;

    const contactItems = [
        { icon: '📍', label: 'Address',        value: s?.contact_address, href: null },
        { icon: '📞', label: 'Phone',           value: s?.contact_phone,   href: `tel:${s?.contact_phone}` },
        { icon: '✉️', label: 'Email',           value: s?.contact_email,   href: `mailto:${s?.contact_email}` },
        ...(openingHours ? [{ icon: '🕐', label: 'Business Hours', value: openingHours, href: null }] : []),
    ];

    return (
        <section
            className="bc-section"
            style={{ backgroundColor: s?.white_color || '#ffffff' }}
        >
            <div className="bc-container">

                {/* ── LEFT ── */}
                <div className="bc-left">
                    <div className="bc-eyebrow">
                        <span
                            className="bc-eyebrow-line"
                            style={{ background: s?.main_color || '#e4e590' }}
                        />
                        <span
                            className="bc-eyebrow-text"
                            style={{ color: s?.main_color || '#e4e590' }}
                        >
                            Reach Out
                        </span>
                    </div>

                    <h1
                        className="bc-heading"
                        style={{ color: s?.color_two || '#0e0d0b' }}
                    >
                        Get in Touch
                    </h1>

                    <p
                        className="bc-sub"
                        style={{ color: s?.color_one || '#a7a7a7' }}
                    >
                        {s?.short_about || 'Whether you are a distributor, pharmacy chain, or healthcare provider — we would love to hear from you.'}
                    </p>

                    <div className="bc-contact-list">
                        {contactItems.map((item, i) => (
                            <div className="bc-contact-item" key={i}>
                                <div
                                    className="bc-icon-box"
                                    style={{
                                        backgroundColor: s?.color_eight || '#121111',
                                        borderColor: s?.color_one || '#a7a7a7',
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <div>
                                    <p
                                        className="bc-contact-label"
                                        style={{ color: s?.main_color || '#e4e590' }}
                                    >
                                        {item.label}
                                    </p>
                                    {item.href
                                        ? <a href={item.href} className="bc-contact-value"
                                            style={{ color: s?.color_two || '#0e0d0b' }}>
                                            {item.value}
                                          </a>
                                        : <p className="bc-contact-value"
                                            style={{ color: s?.color_two || '#0e0d0b' }}>
                                            {item.value}
                                          </p>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT — Form Card ── */}
                <div className="bc-right">
                    <div
                        className="bc-form-card"
                        style={{
                            backgroundColor: s?.color_eight || '#f6f9fa',
                            borderColor: s?.color_one || '#e2eaec',
                        }}
                    >
                        {message && (
                            <div
                                className="bc-alert"
                                style={{
                                    backgroundColor: message.includes('success')
                                        ? s?.color_three || '#699b65'
                                        : '#c0392b',
                                    color: s?.white_color || '#ffffff',
                                }}
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="bc-row">
                                <div className="bc-field">
                                    <label
                                        className="bc-label"
                                        style={{ color: s?.color_two || '#0e0d0b' }}
                                    >
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        className="bc-input"
                                        placeholder="John"
                                        style={{
                                            borderColor: s?.color_one || '#e2eaec',
                                            color: s?.color_two || '#0e0d0b',
                                        }}
                                        value={formData.name.split(' ')[0] || ''}
                                        onChange={(e) => {
                                            const last = formData.name.split(' ').slice(1).join(' ');
                                            handleChange('name', `${e.target.value}${last ? ' ' + last : ''}`);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="bc-field">
                                    <label
                                        className="bc-label"
                                        style={{ color: s?.color_two || '#0e0d0b' }}
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        className="bc-input"
                                        placeholder="Doe"
                                        style={{
                                            borderColor: s?.color_one || '#e2eaec',
                                            color: s?.color_two || '#0e0d0b',
                                        }}
                                        value={formData.name.split(' ').slice(1).join(' ') || ''}
                                        onChange={(e) => {
                                            const first = formData.name.split(' ')[0] || '';
                                            handleChange('name', `${first} ${e.target.value}`.trim());
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="bc-field">
                                <label className="bc-label" style={{ color: s?.color_two || '#0e0d0b' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="bc-input"
                                    placeholder="john@company.com"
                                    style={{ borderColor: s?.color_one || '#e2eaec', color: s?.color_two || '#0e0d0b' }}
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="bc-field">
                                <label className="bc-label" style={{ color: s?.color_two || '#0e0d0b' }}>
                                    Country
                                </label>
                                <select
                                    className="bc-select"
                                    style={{ borderColor: s?.color_one || '#e2eaec', color: s?.color_two || '#0e0d0b' }}
                                    value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    required
                                >
                                    <option value="">Select your country</option>
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="bc-field">
                                <label className="bc-label" style={{ color: s?.color_two || '#0e0d0b' }}>
                                    Product Interest
                                </label>
                                <select
                                    className="bc-select"
                                    style={{ borderColor: s?.color_one || '#e2eaec', color: s?.color_two || '#0e0d0b' }}
                                    value={formData.product_interest}
                                    onChange={(e) => handleChange('product_interest', e.target.value)}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {productInterests.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div className="bc-field">
                                <label className="bc-label" style={{ color: s?.color_two || '#0e0d0b' }}>
                                    Message
                                </label>
                                <textarea
                                    className="bc-textarea"
                                    placeholder="Tell us about your requirements..."
                                    rows="4"
                                    style={{ borderColor: s?.color_one || '#e2eaec', color: s?.color_two || '#0e0d0b' }}
                                    value={formData.message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bc-btn-submit"
                                style={{
                                    backgroundColor: s?.color_two || '#0e0d0b',
                                    color: s?.white_color || '#ffffff',
                                }}
                            >
                                {loading ? 'Submitting...' : 'Send Enquiry →'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default BookingFormContent;