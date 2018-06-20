import React from 'react';

const BookingFooter = ({ isFetchingPricingQuote, onSubmit }) => (
  isFetchingPricingQuote ? (
    <div>
      <button
        className="booking-button"
        onClick={onSubmit}
      >
        <span className="booking-button-text">Book</span>
      </button>
      <div className="booking-charge-text-spacing">
        <div className="text-center">
          <small className="form-fields-label-small">
            <span>{'You won\'t be charged yet'}</span>
          </small>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <button
        className="booking-button"
        onClick={onSubmit}
      >
        <span className="booking-button-text">Request to Book</span>
      </button>
      <div className="booking-charge-text-spacing">
        <div className="text-center">
          <small className="form-fields-label-small">
            <span>{'You won\'t be charged yet'}</span>
          </small>
        </div>
      </div>
    </div>
  )
);

export default BookingFooter;
