import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Deliverydetails.css";

const Deliverydetails = ({ settings, id }) => {
    const steps = [
        {
            number: "01",
            title: "Product Enquiry",
            description:
                "Share your product requirements, quantity, and target market with our team.",
            color: settings?.color_two || "#7BA56E",
        },
        {
            number: "02",
            title: "Documentation",
            description:
                "We handle all regulatory and compliance documentation for the export process.",
            color: settings?.color_three || "#D4AF45",
        },
        {
            number: "03",
            title: "Quality Check",
            description:
                "Rigorous QC and third-party inspection before every consignment ships.",
            color: settings?.color_four || "#4CB6B6",
        },
        {
            number: "04",
            title: "Shipment & Delivery",
            description:
                "Tracked global shipment with full import-clearance support provided.",
            color: settings?.color_five || "#8CA8C2",
        },
    ];

    return (
        <section
            id={id}
            className="delivery-details-section"
            style={{
                backgroundColor: settings?.color_one || "#0c0d0c",
            }}
        >
            <div className="delivery-container">

                <span
                    className="delivery-badge"
                    style={{
                        borderColor: settings?.color_two || "#7BA56E",
                        color: settings?.color_two || "#7BA56E",
                    }}
                >
                    HOW IT WORKS
                </span>

                <h2 className="delivery-title">
                    From Order to Delivery
                </h2>

                <div className="delivery-timeline">

                    {steps.map((step, index) => (
                        <div className="timeline-item" key={index}>

                            <div className="timeline-top">
                                <div
                                    className="timeline-circle"
                                    style={{
                                        borderColor: step.color,
                                    }}
                                >
                                    <div
                                        className="timeline-inner-circle"
                                        style={{
                                            backgroundColor: step.color,
                                        }}
                                    >
                                        {step.number}
                                    </div>
                                </div>

                                {index !== steps.length - 1 && (
                                    <div
                                        className="timeline-line"
                                        style={{
                                            backgroundColor: `${step.color}50`,
                                        }}
                                    />
                                )}
                            </div>

                            <h3
                                className="timeline-title"
                                style={{ color: step.color }}
                            >
                                {step.title}
                            </h3>

                            <p className="timeline-description">
                                {step.description}
                            </p>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Deliverydetails;