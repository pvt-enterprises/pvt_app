import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import './ContactUsPage.css';
import { extractArray } from '../../config/api';

function ContactUsPage() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/settings');
            const data = response.data.data || response.data;
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const s = settings;
    const bg        = s?.color_five    || '#0c0d0c';
    const accent    = s?.color_three   || '#699b65';
    const mainColor = s?.main_color    || '#e4e590';
    const cardBg    = s?.color_seven   || '#151616';
    const border    = s?.color_four    || '#2a2b2c';
    const textMuted = s?.color_one     || '#a7a7a7';
    const textWhite = s?.white_color   || '#ffffff';

    const getDefaultImageUrl = () => {
        const p = s?.default_image;
        if (!p) return null;
        return p.startsWith('http') ? p : `/storage/${p}`;
    };

    const getGoogleMapsEmbedUrl = () =>
        s?.map_embed_url ||
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2289.817743842076!2d-1.6603576232981123!3d54.976295272806695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487e7713c90ad8c7%3A0x1da9e24158e1505c!2s69%20West%20Rd%2C%20Newcastle%20upon%20Tyne%20NE4%209PX%2C%20UK!5e0!3m2!1sen!2sin!4v1768118681006!5m2!1sen!2sin';

    const formatTime = (t) => {
        if (!t) return '';
        const [h, m] = t.split(':');
        const hr = parseInt(h);
        return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
    };

    const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg('');
        try {
            const res = await axios.post('/contact', formData);
            if (res.data.success) {
                setStatusMsg('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
            }
        } catch {
            setStatusMsg('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cu-page" style={{ backgroundColor: bg }}>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                settings={settings}
                onNavigate={(id) => {
                    setSidebarOpen(false);
                    navigate('/');
                    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400);
                }}
            />

            <Navbar settings={settings} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* ── Hero ─────────────────────────────────────────── */}
            <div className="cu-hero">
                {getDefaultImageUrl() && (
                    <div className="cu-hero__bg" style={{ backgroundImage: `url(${getDefaultImageUrl()})` }} />
                )}
                <div className="cu-hero__overlay" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />
                <div className="cu-hero__content">
                    <span className="cu-eyebrow" style={{ color: accent, borderColor: accent }}>
                        GET IN TOUCH
                    </span>
                    <h1 className="cu-hero__title" style={{ color: textWhite }}>Contact Us</h1>
                </div>
            </div>

            {/* ── Map + Info cards ─────────────────────────────── */}
            <div className="cu-map-section" style={{ backgroundColor: bg }}>
                <div className="cu-map-wrap">
                    <div className="cu-map">
                        <iframe
                            src={getGoogleMapsEmbedUrl()}
                            width="100%" height="100%"
                            style={{ border: 0 }}
                            allowFullScreen loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Map"
                        />
                    </div>

                    <div className="cu-info-cards">
                        {s?.shop_start_time && (
                            <div className="cu-info-card" style={{ backgroundColor: cardBg, borderColor: border }}>
                                <div className="cu-info-icon" style={{ color: accent }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: accent }}>Working Hours</h4>
                                <p style={{ color: textMuted }}>
                                    {formatTime(s.shop_start_time)} – {formatTime(s.shop_close_time)}
                                </p>
                            </div>
                        )}

                        {s?.contact_address && (
                            <div className="cu-info-card cu-info-card--accent" style={{ backgroundColor: accent }}>
                                <div className="cu-info-icon" style={{ color: bg }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: bg }}>Address</h4>
                                <p style={{ color: bg, opacity: 0.8 }}>{s.contact_address}</p>
                            </div>
                        )}

                        {s?.contact_phone && (
                            <div className="cu-info-card" style={{ backgroundColor: cardBg, borderColor: border }}>
                                <div className="cu-info-icon" style={{ color: accent }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: accent }}>Phone</h4>
                                <a href={`tel:${s.contact_phone}`} style={{ color: textWhite, textDecoration: 'none' }}>
                                    {s.contact_phone}
                                </a>
                            </div>
                        )}

                        {s?.contact_email && (
                            <div className="cu-info-card" style={{ backgroundColor: cardBg, borderColor: border }}>
                                <div className="cu-info-icon" style={{ color: accent }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: accent }}>Email</h4>
                                <a href={`mailto:${s.contact_email}`} style={{ color: textWhite, textDecoration: 'none' }}>
                                    {s.contact_email}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Contact form ─────────────────────────────────── */}
            <div className="cu-form-section" style={{ backgroundColor: bg }}>
                <div className="cu-form-wrap">
                    <div className="cu-form-header">
                        <span className="cu-eyebrow" style={{ color: accent, borderColor: accent }}>
                            SEND A MESSAGE
                        </span>
                        <h2 style={{ color: textWhite }}>We'd love to hear from you</h2>
                    </div>

                    {statusMsg === 'success' && (
                        <div className="cu-alert cu-alert--success" style={{ borderColor: accent, color: accent }}>
                            ✓ Message sent successfully! We'll get back to you soon.
                        </div>
                    )}
                    {statusMsg === 'error' && (
                        <div className="cu-alert cu-alert--error">
                            ✕ Failed to send message. Please try again.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="cu-form" style={{ backgroundColor: cardBg, borderColor: border }}>
                        <div className="cu-form-row">
                            <div className="cu-form-group">
                                <label style={{ color: textMuted }}>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Your name"
                                    required
                                    className="cu-input"
                                    style={{ backgroundColor: bg, borderColor: border, color: textWhite }}
                                />
                            </div>
                            <div className="cu-form-group">
                                <label style={{ color: textMuted }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="cu-input"
                                    style={{ backgroundColor: bg, borderColor: border, color: textWhite }}
                                />
                            </div>
                        </div>

                        <div className="cu-form-group">
                            <label style={{ color: textMuted }}>Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="Your phone number"
                                required
                                className="cu-input"
                                style={{ backgroundColor: bg, borderColor: border, color: textWhite }}
                            />
                        </div>

                        <div className="cu-form-group">
                            <label style={{ color: textMuted }}>Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                placeholder="Tell us about your requirements..."
                                rows="5"
                                required
                                className="cu-textarea"
                                style={{ backgroundColor: bg, borderColor: border, color: textWhite }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cu-submit-btn"
                            style={{ backgroundColor: accent, color: bg }}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
            <WhatsAppButton phone={s?.whatsapp_number || s?.contact_phone || '9496757243'} />
        </div>
    );
}

export default ContactUsPage;