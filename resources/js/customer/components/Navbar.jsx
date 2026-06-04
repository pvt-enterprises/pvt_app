import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getStorageUrl, extractArray } from '../../config/api';
import './Navbar.css';

function Navbar({ settings, sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        axios.get('/menu-links')
            .then(res => {
                const items = extractArray(res);
                setMenuItems(items.filter(i => i.link_type === 'top_menu' && i.is_active));
            })
            .catch(err => console.error('Error fetching menu:', err));
    }, []);

    const getLogoUrl = () => {
        const path = settings?.website_logo || settings?.logo;
        if (!path) return null;
        return getStorageUrl(path);
    };

    const handleNavClick = (item) => {
        const url = item.url || item.link_url || '';

        if (item.target === '_blank') {
            window.open(url, '_blank');
            return;
        }

        /* Hash scroll: /#about, /#footer etc */
        if (url.startsWith('/#')) {
            const sectionId = url.replace('/#', '');
            if (location.pathname === '/') {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                setTimeout(() => {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
            return;
        }

        /* Internal route */
        if (url.startsWith('/')) {
            navigate(url);
            return;
        }

        /* External */
        if (url && url !== '#') {
            window.location.href = url;
        }
    };

    return (
        <nav
            className="shared-navbar"
            style={{ backgroundColor: settings?.white_color || '#ffffff' }}
        >
            <div className="shared-navbar__inner">

                {/* Hamburger */}
                <button
                    className="shared-navbar__hamburger"
                    onClick={() => setSidebarOpen && setSidebarOpen(true)}
                    aria-label="Open menu"
                    style={{
                        background: settings?.main_color,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '6px',
                    }}
                >
                    <span style={{ display: 'block', width: '26px', height: '2px', backgroundColor: settings?.color_three || '#699b65', borderRadius: '2px' }} />
                    <span style={{ display: 'block', width: '18px', height: '2px', backgroundColor: settings?.color_three || '#699b65', borderRadius: '2px' }} />
                    <span style={{ display: 'block', width: '26px', height: '2px', backgroundColor: settings?.color_three || '#699b65', borderRadius: '2px' }} />
                </button>

                {/* Logo */}
                <div className="shared-navbar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    {getLogoUrl() ? (
                        <img src={getLogoUrl()} alt={settings?.site_name || 'Logo'} />
                    ) : (
                        <span style={{ color: settings?.black_color || '#000', fontWeight: 600, fontSize: '1.2rem' }}>
                            {settings?.site_name || 'PVT Enterprises'}
                        </span>
                    )}
                </div>

                {/* Nav links */}
                <ul className="shared-navbar__links">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <button
                                className="shared-navbar__link"
                                onClick={() => handleNavClick(item)}
                                style={{ color: settings?.black_color || '#1a1a1a' }}
                            >
                                {item.link_text || item.title}
                            </button>
                        </li>
                    ))}
                </ul>

            </div>
        </nav>
    );
}

export default Navbar;