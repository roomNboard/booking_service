import React, { Component } from 'react';
import FlexBarSelectGuest from './select-guest-flexbar/FlexBarSelectGuest';

const selectGuestKeys = {
  adults: 'guest_picker_adults_capitalized',
  children: 'guest_picker_children_capitalized',
  infants: 'guest_picker_infants_capitalized',
};

const selectGuestLabels = {
  adults: 'Adults',
  children: 'Children',
  infants: 'Infants',
};

const containerStyle = {
  Adults: 'filter-dropdown-item-smaller-container',
  Children: 'filter-dropdown-item-larger-container',
  Infants: 'filter-dropdown-item-larger-container',
};

const GuestCountFilter = ({ isFocused, maxGuests, maximumBooked, guestDetails, updateGuestDetails }) => (
  isFocused ? (
    <div
      className="guest-count-filter-container"
    >
      <div className="guest-count-filter-dropdown-container">
        {Object.keys(guestDetails).map(guest =>
          (
            <FlexBarSelectGuest
              maximumBooked={maximumBooked}
              guestDetails={guestDetails}
              updateGuestDetails={updateGuestDetails}
              label={selectGuestLabels[guest]}
              guestType={guest}
              numOfGuests={guestDetails[guest]}
              key={selectGuestKeys[guest]}
              containerStyle={containerStyle}
            />
          ))
        }
      </div>
    </div>
  ) : (
    null
  )
);

export default GuestCountFilter;
