import React from 'react';

const PricingDetails = ({ price }) => (
  <div className="header-pricing-container">
    <div className="header-pricing-content-container">
      <span className="header-pricing-dollar-amount">
        <span>${price}</span>
        {' '}
      </span>
      <span className="header-pricing-per-night">
        <span>per night</span>
      </span>
    </div>
  </div>
);

export default PricingDetails;
