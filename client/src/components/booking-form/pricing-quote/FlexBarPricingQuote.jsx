import React from 'react';

const FlexBarPricingQuote = ({ last, text, cost }) => (
  last ? (
    <div className="price-quote-form-container">
      <div className="flexbar-content-container">
        <div className="flexbar-content-text">
          <span className="flexbar-text large">
            <span>{text}</span>
          </span>
        </div>
        <div className="flexbar-content-icon">
          <span className="flexbar-text large">
            <span>{cost}</span>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="price-quote-form-container">
      <div className="flexbar-content-container">
        <div className="flexbar-content-text">
          <span className="flexbar-text">
            <span>{text}</span>
          </span>
        </div>
        <div className="flexbar-content-icon">
          <span className="flexbar-text">
            <span>{cost}</span>
          </span>
        </div>
      </div>
      <div className="spacing-pricing-quote">
        <div className="flexbar-spacing-line" />
      </div>
    </div>
  )
);

export default FlexBarPricingQuote;
