import React from 'react';
import FlexBarSelectGuestTextOption from './FlexBarSelectGuestTextOption';
import FlexBarSelectGuestButtons from './FlexBarSelectGuestButtons';

const FlexBarSelectGuest = ({ label, guestType, numOfGuests, guestDetails, updateGuestDetails, containerStyle, maximumBooked }) => (
  <div className={containerStyle[label]}>
    <FlexBarSelectGuestTextOption
      label={label}
      noSubDescription={guestType === 'adults'}
    />
    <div className="flexbar-content-icon">
      <FlexBarSelectGuestButtons
        selectedGuests={guestDetails[guestType]}
        guestType={guestType}
        maximumBooked={maximumBooked}
        updateGuestDetails={updateGuestDetails}
      />
    </div>
  </div>
);

export default FlexBarSelectGuest;
