import React from 'react';
import SelectGuestButton from './SelectGuestButton';

const isLeftButton = {
  left: true,
  right: false,
};

const FlexBarSelectGuestButtons = ({ selectedGuests, guestType, maximumBooked, updateGuestDetails }) => (
  <div className="flexbar-content-icon">
    <div className="filter-flexbar-buttons-container">
      <div className="filter-flexbar-button-left-container">
        <SelectGuestButton
          side={isLeftButton.left}
          selectedGuests={selectedGuests}
          guestType={guestType}
          disabled={selectedGuests === 0}
          updateGuestDetails={updateGuestDetails}
        />
      </div>
      <div className="filter-flexbar-button-value-container">
        {selectedGuests}
      </div>
      <div className="filter-flexbar-button-right-container">
        <SelectGuestButton
          side={isLeftButton.right}
          selectedGuests={selectedGuests}
          guestType={guestType}
          disabled={maximumBooked}
          updateGuestDetails={updateGuestDetails}
        />
      </div>
    </div>
  </div>
);

export default FlexBarSelectGuestButtons;
