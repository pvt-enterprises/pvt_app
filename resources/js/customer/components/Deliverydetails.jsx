import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deliverydetails.css';

const steps = [
    {
        number: '01',
        title: 'Product Enquiry',
        desc: 'Share your product requirements, quantity, and target market with our team.',
    },
    {
        number: '02',
        title: 'Documentation',
        desc: 'We handle all regulatory and compliance documentation for the export.',
    },
    {
        number: '03',
        title: 'Quality Check',
        desc: 'Rigorous QC and third-party inspection before every consignment ships.',
    },
    {
        number: '04',
        title: 'Shipment & Delivery',
        desc: 'Tracked global shipment with full import-clearance support provided.',
    },
];

/* Maps each step index to a CSS variable so colours stay in sync with dashboard */
const stepAccents = [
    'var(--color-three)',   /* 01 – green */
    'var(--main-color)',    /* 02 – gold  */
    'var(--color-six)',     /* 03 – teal  */
    'var(--color-two)',     /* 04 – muted */
];

function DeliveryDetails({ id }) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios
            .get('/settings')
            .then(res => setSettings(res.data.data || res.data))
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    /* Inject CSS variables so every child can consume them */
    const cssVars = settings
        ? {
              '--color-one':   settings.color_one   || '#0c0d0c',
              '--color-two':   settings.color_two   || '#a7a7a7',
              '--color-three': settings.color_three || '#699b65',
              '--color-four':  settings.color_four  || '#2a2b2c',
              '--color-five':  settings.color_five  || '#151616',
              '--color-six':   settings.color_six   || '#699b65',
              '--main-color':  settings.main_color  || '#c9a84c',
          }
        : {};

    return (
        <section id={id} className="hiw-section" style={cssVars}>
            <div className="hiw-container">

                {/* ── LEFT PANEL ─────────────────────────────────────────── */}
                <div className="hiw-left">
                    <span className="hiw-eyebrow">How It Works</span>
                    <h2 className="hiw-heading">
                        From Order<br />to Delivery
                    </h2>
                    <p className="hiw-subtext">
                        A transparent, end-to-end process built for
                        hassle-free global exports.
                    </p>
                </div>

                {/* ── RIGHT PANEL – vertical stepper ──────────────────────── */}
                <div className="hiw-right">
                    {steps.map((step, index) => (
                        <div className="hiw-step" key={index}>

                            {/* Circle + vertical connector */}
                            <div className="hiw-track">
                                <div
                                    className="hiw-circle-outer"
                                    style={{ borderColor: stepAccents[index] }}
                                >
                                    <div
                                        className="hiw-circle-inner"
                                        style={{ backgroundColor: stepAccents[index] }}
                                    >
                                        {step.number}
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className="hiw-connector"
                                        style={{ background: stepAccents[index] }}
                                    />
                                )}
                            </div>

                            {/* Text */}
                            <div className="hiw-content">
                                <h3
                                    className="hiw-step-title"
                                    style={{ color: stepAccents[index] }}
                                >
                                    {step.title}
                                </h3>
                                <p className="hiw-step-desc">{step.desc}</p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default DeliveryDetails;