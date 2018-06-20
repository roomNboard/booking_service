import React, { Component } from 'react';
import FlexBar from './FlexBar';
import GuestCountFilter from './GuestCountFilter';

class GuestPickerTrigger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      maximumBooked: false,
      guestDetails: this.props.guestDetails,
    };

    this.guestDropDown = React.createRef();
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.handleGuestPickerFocus = this.handleGuestPickerFocus.bind(this);
    this.updateGuestDetails = this.updateGuestDetails.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', e => this.onOutsideClick(e), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onOutsideClick(e) {
    if (this.guestDropDown.current.contains(e.target)) {
      return;
    }
    if (this.state.isFocused) {
      this.handleGuestPickerFocus();
    }
  }

  handleGuestPickerFocus() {
    this.setState({
      isFocused: !this.state.isFocused,
    });
    this.props.onGuestPickerFocus();
  }

  updateGuestDetails(side, disabled, guestType) {
    const updatedDetails = { ...this.state.guestDetails };
    updatedDetails[guestType] = side ? updatedDetails[guestType] -= 1 : updatedDetails[guestType] += 1;

    let currentGuests = 0;
    Object.keys(updatedDetails).forEach((guest) => {
      currentGuests += updatedDetails[guest];
    });

    if (currentGuests <= this.props.listing.maxGuests) {
      this.setState({
        guestDetails: updatedDetails,
      }, () => {
        this.isMaximumBooked(currentGuests);
        this.props.onGuestDetailsUpdate(this.state.guestDetails);
      });
    }
  }

  isMaximumBooked(currentGuests) {
    if (currentGuests >= this.props.listing.maxGuests) {
      this.setState({
        maximumBooked: true,
      });
    } else if (currentGuests < this.props.listing.maxGuests) {
      this.setState({
        maximumBooked: false,
      });
    }
  }

  render() {
    const triggerButtonStyle = (this.props.isFocused ?
      'guest-picker-trigger-selected' :
      'guest-picker-trigger-not-selected');
    const renderChildTag = (this.state.guestDetails.children > 0);

    return (
      <div className="guest-picker-trigger-container">
        <button
          onClick={this.handleGuestPickerFocus}
          className={`${triggerButtonStyle}`}
        >
          <div className="guest-picker-trigger-content-spacing">
            <div className="guest-picker-flexbar-container">
              <FlexBar
                isFocused={this.state.isFocused}
                guestDetails={this.state.guestDetails}
                renderChildTag={renderChildTag}
              />
            </div>
          </div>
        </button>
        <div ref={this.guestDropDown}>
          <GuestCountFilter
            updateGuestDetails={this.updateGuestDetails}
            isFocused={this.state.isFocused}
            maxGuests={this.props.listing.maxGuests}
            maximumBooked={this.state.maximumBooked}
            guestDetails={this.state.guestDetails}
          />
        </div>
      </div>
    );
  }
}

export default GuestPickerTrigger;
