import React from 'react';
import "./Deliverydetails.css";

const steps = [
    {
        number: "01",
        title: "Product Enquiry",
        description: "Share your product requirements, quantity, and target market with our team.",
        colorKey: "color_two",
        fallback: "#7BA56E",
    },
    {
        number: "02",
        title: "Documentation",
        description: "We handle all regulatory and compliance documentation for the export process.",
        colorKey: "color_three",
        fallback: "#D4AF45",
    },
    {
        number: "03",
        title: "Quality Check",
        description: "Rigorous QC and third-party inspection before every consignment ships.",
        colorKey: "color_four",
        fallback: "#4CB6B6",
    },
    {
        number: "04",
        title: "Shipment & Delivery",
        description: "Tracked global shipment with full import-clearance support provided.",
        colorKey: "color_five",
        fallback: "#8CA8C2",
    },
];

const Deliverydetails = ({ settings, id }) => {
    const getColor = (key, fallback) => settings?.[key] || fallback;

    const badgeColor = getColor("color_two", "#7BA56E");
    const bgColor    = getColor("color_one", "#0c0d0c");

    const stepsWithColor = steps.map(s => ({
        ...s,
        color: getColor(s.colorKey, s.fallback),
    }));

    return (
        <section
            id={id}
            className="delivery-details-section"
            style={{ backgroundColor: bgColor }}
        >
            <div className="delivery-container">

                {/* Header */}
                <span
                    className="delivery-badge"
                    style={{ borderColor: badgeColor, color: badgeColor }}
                >
                    HOW IT WORKS
                </span>
                <h2 className="delivery-title">From Order to Delivery</h2>

                {/* ── HORIZONTAL layout (desktop) ─────────────────────── */}

                {/* Row 1 — circles + full-width connecting lines */}
                <div className="delivery-track-row">
                    {stepsWithColor.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="delivery-circle-slot">
                                <div
                                    className="timeline-circle"
                                    style={{ borderColor: step.color }}
                                >
                                    <div
                                        className="timeline-inner-circle"
                                        style={{ backgroundColor: step.color }}
                                    >
                                        {step.number}
                                    </div>
                                </div>
                            </div>

                            {index < stepsWithColor.length - 1 && (
                                <div
                                    className="timeline-line"
                                    style={{ backgroundColor: step.color }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Row 2 — labels under each circle */}
                <div className="delivery-labels-row">
                    {stepsWithColor.map((step, index) => (
                        <div className="delivery-label" key={index}>
                            <h3
                                className="timeline-title"
                                style={{ color: step.color }}
                            >
                                {step.title}
                            </h3>
                            <p className="timeline-description">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* ── VERTICAL layout (tablet / mobile) ───────────────── */}
                <div className="delivery-vertical">
                    {stepsWithColor.map((step, index) => (
                        <div className="delivery-v-step" key={index}>
                            <div className="delivery-v-track">
                                <div
                                    className="timeline-circle"
                                    style={{ borderColor: step.color }}
                                >
                                    <div
                                        className="timeline-inner-circle"
                                        style={{ backgroundColor: step.color }}
                                    >
                                        {step.number}
                                    </div>
                                </div>
                                {index < stepsWithColor.length - 1 && (
                                    <div
                                        className="delivery-v-line"
                                        style={{ backgroundColor: step.color }}
                                    />
                                )}
                            </div>
                            <div className="delivery-v-content">
                                <h3
                                    className="timeline-title"
                                    style={{ color: step.color }}
                                >
                                    {step.title}
                                </h3>
                                <p className="timeline-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Deliverydetails;