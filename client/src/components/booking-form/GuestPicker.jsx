import React, { Component } from 'react';
import GuestPickerTrigger from './GuestPickerTrigger';

class GuestPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="guest-picker-container">
        <div className="guest-picker-dropdown-container guest-picker-container">
          <GuestPickerTrigger
            onGuestPickerFocus={this.props.onGuestPickerFocus}
            onGuestDetailsUpdate={this.props.onGuestDetailsUpdate}
            guestDetails={this.props.guestDetails}
            listing={this.props.listing}
          />
        </div>
      </div>
    );
  }
}

export default GuestPicker;
