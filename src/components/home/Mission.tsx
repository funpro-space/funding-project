"use client";

import React from 'react';

export default function Mission() {
  return (
    <section className="mission-section py-5 md:py-12 relative">
      {/* Decorative background glow matching site standard */}
      <div className="mission-glow-bg" />

      <div className="mission-container">
        {/* Styled Section Header */}
        <div className="mission-header">
          <span className="mission-badge">Our Mission</span>
          <h3 className="brand-h3 mission-title">Building With Intention</h3>
        </div>

        {/* Content Paragraphs */}
        <div className="mission-content">
          <p className="mission-paragraph-lead">
            When we fund a project—we are building something that impacts every aspect of life around us. The right process allows ideas to grow, improving our communities, our planet, and how we connect.
          </p>
          
          <p className="mission-paragraph-body">
             We believe our projects should be a source of long-term health and renewal. By bringing a strategic, mindful approach to project development and capital options, we are creating a flexible, positive environment where connections and ideas grow sustainably.
          </p>
          
          <p className="mission-paragraph-quote">
            Let&apos;s make this process feel fresh and renewing. Let&apos;s feel the healing happen as we make intentional adjustments, think strategically, and build a healthier future.
          </p>
        </div>
      </div>
    </section>
  );
}
