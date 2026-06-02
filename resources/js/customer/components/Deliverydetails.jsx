import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deliverydetails.css';

const steps = [
    {
        number: '01',
        title: 'Product Enquiry',
        desc: 'Share your product requirements, quantity, and target market with our team.',
        accentKey: 'color_three',
        fallback: '#699b65',
    },
    {
        number: '02',
        title: 'Documentation',
        desc: 'We handle all regulatory and compliance documentation for the export.',
        accentKey: 'main_color',
        fallback: '#c9a84c',
    },
    {
        number: '03',
        title: 'Quality Check',
        desc: 'Rigorous QC and third-party inspection before every consignment ships.',
        accentKey: 'color_six',
        fallback: '#4a9b8e',
    },
    {
        number: '04',
        title: 'Shipment & Delivery',
        desc: 'Tracked global shipment with full import-clearance support provided.',
        accentKey: 'color_two',
        fallback: '#7a9db5',
    },
];

function DeliveryDetails({ id }) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios
            .get('/settings')
            .then(res => setSettings(res.data.data || res.data))
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const getColor = (key, fallback) => settings?.[key] || fallback;

    const cssVars = {
        '--color-one':   getColor('color_one',   '#0c0d0c'),
        '--color-two':   getColor('color_two',   '#a7a7a7'),
        '--color-three': getColor('color_three', '#699b65'),
        '--color-four':  getColor('color_four',  '#2a2b2c'),
        '--color-five':  getColor('color_five',  '#151616'),
        '--color-six':   getColor('color_six',   '#4a9b8e'),
        '--main-color':  getColor('main_color',  '#c9a84c'),
    };

    return (
        <section id={id} className="dd-section" style={cssVars}>
            <div className="dd-container">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="dd-header">
                    <span className="dd-eyebrow">How It Works</span>
                    <h2 className="dd-heading">From Order to Delivery</h2>
                </div>

                {/* ── Timeline ───────────────────────────────────────── */}
                <div className="dd-timeline">

                    {/* Row 1 — circles with full-width lines between them */}
                    <div className="dd-track-row">
                        {steps.map((step, index) => {
                            const accent = getColor(step.accentKey, step.fallback);
                            return (
                                <React.Fragment key={index}>
                                    <div className="dd-circle-wrap">
                                        <div
                                            className="dd-circle-outer"
                                            style={{ borderColor: accent }}
                                        >
                                            <div
                                                className="dd-circle-inner"
                                                style={{ backgroundColor: accent }}
                                            >
                                                {step.number}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Line fills ALL space between this circle and next */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className="dd-line"
                                            style={{ backgroundColor: accent }}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Row 2 — labels aligned under each circle */}
                    <div className="dd-labels-row">
                        {steps.map((step, index) => {
                            const accent = getColor(step.accentKey, step.fallback);
                            return (
                                <div
                                    className="dd-label"
                                    key={index}
                                    data-number={step.number}
                                >
                                    <div className="dd-label-text">
                                        <h3
                                            className="dd-step-title"
                                            style={{ color: accent }}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="dd-step-desc">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}

export default DeliveryDetails;