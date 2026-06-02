import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';
import { API_BASE_URL, getStorageUrl, extractArray } from '../../config/api';

function Sidebar({ isOpen, onClose, menuItems, settings, onNavigate }) {
    const navigate = useNavigate();
    const [topMenuLinks, setTopMenuLinks] = useState([]);
    const [pages, setPages] = useState({});

    /* Inject sidebar-specific CSS variables from dashboard settings */
    const sidebarVars = {
        '--sb-bg':     settings?.color_eight || settings?.color_one || '#0a0a0a',
        '--sb-accent': settings?.main_color  || '#e4e590',
        '--sb-text':   settings?.white_color || '#ffffff',
    };

    useEffect(() => {
        if (isOpen) {
            setTopMenuLinks([]);
            setPages({});
            fetchTopMenuLinks();
            fetchPages();
        }
    }, [isOpen]);

    const fetchTopMenuLinks = async () => {
        try {
            const response = await axios.get('/menu-links');
            const allLinks = extractArray(response);
            const activeTopLinks = allLinks
                .filter(link => link.is_active && link.link_type === 'top_menu')
                .sort((a, b) => a.order - b.order);
            setTopMenuLinks(activeTopLinks);
        } catch (error) {
            console.error('Error fetching menu links:', error);
            setTopMenuLinks([]);
        }
    };

    const fetchPages = async () => {
        try {
            const response = await axios.get('/pages');
            const allPages = extractArray(response);
            const pagesMap = {};
            allPages.forEach(page => { pagesMap[page.id] = page; });
            setPages(pagesMap);
        } catch (error) {
            console.error('Error fetching pages:', error);
            setPages({});
        }
    };

    const handleTopMenuLinkClick = (link) => {
        if (link.page_id && pages[link.page_id]) {
            const page = pages[link.page_id];
            navigate(`/page/${page.slug}`, { state: { page } });
            onClose();
            return;
        }

        if (link.url) {
            if (link.url.startsWith('#')) {
                const sectionId = link.url.replace('#', '');
                navigate('/');
                setTimeout(() => {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                onClose();
                return;
            }
            if (link.url.startsWith('/')) {
                navigate(link.url);
                onClose();
                return;
            }
            if (link.url !== '#') {
                link.target === '_blank'
                    ? window.open(link.url, '_blank')
                    : (window.location.href = link.url);
                onClose();
                return;
            }
        }
        onClose();
    };

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

            <div
                className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
                style={sidebarVars}
            >
                <button className="sidebar-close" onClick={onClose}>×</button>

                {/* ── Menu links — primary focus ───────────────── */}
                <nav className="sidebar-nav">
                    <p className="sidebar-section-title">Menu</p>

                    {topMenuLinks.length > 0 ? (
                        topMenuLinks.map(link => (
                            <button
                                key={link.id}
                                className="sidebar-link sidebar-link-highlight"
                                onClick={() => handleTopMenuLinkClick(link)}
                            >
                                <span className="diamond">◆</span>
                                {link.link_text || link.title}
                            </button>
                        ))
                    ) : (
                        <p className="no-links-message">No menu links available</p>
                    )}
                </nav>

                {/* ── Footer info — compact, secondary ─────────── */}
                <div className="sidebar-footer">
                    <h3>Visit Us</h3>

                    {settings?.contact_address && (
                        <p className="sidebar-address">{settings.contact_address}</p>
                    )}
                    {settings?.shop_start_time && settings?.shop_close_time && (
                        <p className="sidebar-timing">
                            {settings.shop_start_time} – {settings.shop_close_time}
                        </p>
                    )}
                    {settings?.contact_email && (
                        <p className="sidebar-email">{settings.contact_email}</p>
                    )}

                    {settings?.contact_phone && (
                        <>
                            <div className="sidebar-divider-small" />
                            <p className="booking-label">Booking</p>
                            <a
                                href={`tel:${settings.contact_phone}`}
                                className="sidebar-phone"
                            >
                                {settings.contact_phone}
                            </a>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;