import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deliverydetails.css';

const steps = [
    {
        number: '01',
        title: 'Product Enquiry',
        desc: 'Share your product requirements, quantity, and target market with our team.',
        colorVar: 'var(--color-three)',       /* green */
    },
    {
        number: '02',
        title: 'Documentation',
        desc: 'We handle all regulatory and compliance documentation for the export.',
        colorVar: 'var(--main-color)',         /* gold */
    },
    {
        number: '03',
        title: 'Quality Check',
        desc: 'Rigorous QC and third-party inspection before every consignment ships.',
        colorVar: 'var(--color-six)',          /* mid teal */
    },
    {
        number: '04',
        title: 'Shipment & Delivery',
        desc: 'Tracked global shipment with full import-clearance support provided.',
        colorVar: 'var(--color-two)',          /* dark teal */
    },
];

function DeliveryDetails() {
    return (
        <section className="dd-section">
            <div className="dd-container">

                {/* Eyebrow */}
                <div className="dd-eyebrow">
                    <span className="dd-eyebrow-line" />
                    <span className="dd-eyebrow-text">How It Works</span>
                    <span className="dd-eyebrow-line" />
                </div>

                <h2 className="dd-heading">From Order to Delivery</h2>

                {/* Steps */}
                <div className="dd-steps-row">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="dd-step">
                                {/* Circle */}
                                <div className="dd-circle-outer">
                                    <div
                                        className="dd-circle-inner"
                                        style={{ backgroundColor: step.colorVar }}
                                    >
                                        {step.number}
                                    </div>
                                </div>
                                {/* Text */}
                                <p className="dd-step-title">{step.title}</p>
                                <p className="dd-step-desc">{step.desc}</p>
                            </div>

                            {/* Connector line between steps */}
                            {index < steps.length - 1 && (
                                <div className="dd-connector" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default DeliveryDetails;