import React from 'react';
import FlexBarPricingQuote from './FlexBarPricingQuote';

const PriceQuotePresets = {
  serviceFee: 3,
  last: true,
};

const PricingQuote = ({ isFetchingPricingQuote, tripDuration, nightsTxt, price, guestDetails, areaTax, cleaningFee }) => (
  isFetchingPricingQuote ? (
    <div>
      <FlexBarPricingQuote
        last={false}
        text={`$${price} x ${tripDuration} ${nightsTxt}`}
        cost={tripDuration * price}
      />
      <FlexBarPricingQuote
        last={false}
        text="Cleaning fee"
        cost={`$${cleaningFee}`}
      />
      <FlexBarPricingQuote
        last={false}
        text="Service fee"
        cost={`$${Math.floor(PriceQuotePresets.serviceFee * price * 0.075)}`}
      />
      <FlexBarPricingQuote
        last={false}
        text="Occupancy taxes and fees"
        cost={`$${areaTax}`}
      />
      <FlexBarPricingQuote
        last={PriceQuotePresets.last}
        text="Total"
        cost={`$${(tripDuration * price) + cleaningFee + (Math.floor(PriceQuotePresets.serviceFee * price * 0.075)) + areaTax}`}
      />
    </div>
  ) : (
    null
  )
);

export default PricingQuote;
