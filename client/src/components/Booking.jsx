import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import '../assets/booking.css';
import BookingHeader from './booking-header/BookingHeader';
import BookingFooter from './booking-footer/BookingFooter';
import BookingCalendar from './booking-form/BookingCalendar';
import GuestPicker from './booking-form/GuestPicker';
import PricingQuote from './booking-form/pricing-quote/PricingQuote';

const moment = extendMoment(Moment);

const PRICE_PRESETS = {
  serviceFee: 3,
  multiple: 0.075,
};

class Booking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedDateInput: null,
      selectedStartDate: null,
      selectedEndDate: null,
      isFetchingPricingQuote: false,
      guestPickerFocus: false,
      guestDetails: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      tripDuration: 0,
    };

    this.getRoomListing = this.getRoomListing.bind(this);
    this.onGuestPickerFocus = this.onGuestPickerFocus.bind(this);
    this.onGuestDetailsUpdate = this.onGuestDetailsUpdate.bind(this);
    this.setTripDates = this.setTripDates.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.setTripDetailsFormRef = this.setTripDetailsFormRef.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getRoomListing(Math.floor(Math.random() * (99)) + 1000);
  }

  onGuestPickerFocus() {
    this.setState({
      guestPickerFocus: !this.state.guestPickerFocus,
    });
  }

  onGuestDetailsUpdate(updatedDetails) {
    this.setState({
      guestDetails: updatedDetails,
    });
  }

  handleFocusChange(focusedInput) {
    this.setState({
      focusedDateInput: focusedInput,
    });
  }

  setTripDetailsFormRef() {
    const bookedRange = moment.range(this.state.selectedStartDate, this.state.selectedEndDate);
    const daysBooked = bookedRange.diff('days');

    this.setState({
      tripDuration: daysBooked,
    }, () => {
      if (!this.state.isFetchingPricingQuote) {
        this.setState({
          isFetchingPricingQuote: !this.state.isFetchingPricingQuote,
        });
      }
    });
  }

  getRoomListing(id) {
    axios.get(`/booking/${id}`)
      .then(({ data }) => {
        const bookings = data.results.bookings;
        const listing = data.results.listing[0];
        const owner = data.results.owner[0];
        const reviews = data.results.reviews[0];

        this.setState({
          bookings,
          listing,
          owner,
          reviews,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSubmit() {
    if (!this.state.selectedStartDate) {
      this.setState({
        focusedDateInput: 'startDate',
      });
    } else if (!this.state.selectedEndDate) {
      this.setState({
        focusedDateInput: 'endDate',
      });
    } else {
      this.onSubmitTripDetailsWithDates();
    }
  }

  onSubmitTripDetailsWithDates() {
    const { price, cleaningFee, areaTax, id } = this.state.listing;
    const { ownerName } = this.state.owner;
    const tripDuration = this.state.tripDuration;
    const tripStart = this.state.selectedStartDate.format('YYYY-MM-DD');
    const tripEnd = this.state.selectedEndDate.format('YYYY-MM-DD');
    const tripCost = (tripDuration * price) + cleaningFee + (Math.floor(PRICE_PRESETS.serviceFee * price * PRICE_PRESETS.multiple)) + areaTax;
    const tripDetails = {
      listingID: id,
      ownerName,
      checkIn: tripStart,
      checkOut: tripEnd,
      guestDetails: this.state.guestDetails,
      cost: tripCost,
    };
    this.checkoutWithTripDetails(tripDetails);
  }

  setTripDates(startDate, endDate) {
    this.setState({
      selectedStartDate: startDate || null,
      selectedEndDate: endDate || null,
    }, () => {
      if (this.state.selectedStartDate && this.state.selectedEndDate) {
        this.setTripDetailsFormRef(this.state.selectedStartDate, this.state.selectedEndDate);
      }
    });
  }

  checkoutWithTripDetails(tripDetails) {
    axios.post('/booking', tripDetails)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.bookings && this.state.listing && this.state.owner && this.state.reviews) {
      return (
        <div className="position-booking">
          <div className="container-booking">
            <div className="booking-parent-spacing">
              <div className="booking-header-parent">
                <BookingHeader listing={this.state.listing} reviews={this.state.reviews} />
              </div>
              <div id="booking-form">
                <div className="booking-form-fields">
                  <div className="form-fields-spacing-dates">
                    <div>
                      <div id={`dates_${this.state.listing.id}`} className="form-fields-label">
                        <small className="form-fields-label-small">
                          <span>Dates</span>
                        </small>
                      </div>
                      <BookingCalendar
                        bookings={this.state.bookings}
                        handleFocusChange={this.handleFocusChange}
                        focusedDateInput={this.state.focusedDateInput}
                        bookedDates={this.state.bookings.map(b => moment.range(b.startDate, b.endDate))}
                        setTripDates={this.setTripDates}
                      />
                    </div>
                  </div>
                  <div className="form-fields-spacing-guests">
                    <div id={`dates_${this.state.listing.id}`} className="form-fields-label">
                      <small className="form-fields-label-small">
                        <span>Guests</span>
                      </small>
                    </div>
                    <GuestPicker
                      onGuestPickerFocus={this.onGuestPickerFocus}
                      onGuestDetailsUpdate={this.onGuestDetailsUpdate}
                      guestPickerFocus={this.state.guestPickerFocus}
                      guestDetails={this.state.guestDetails}
                      listing={this.state.listing}
                    />
                  </div>
                </div>
                <PricingQuote
                  isFetchingPricingQuote={this.state.isFetchingPricingQuote}
                  guestDetails={this.state.guestDetails}
                  tripDuration={this.state.tripDuration}
                  nightsTxt={this.state.tripDuration > 1 ? 'nights' : 'night'}
                  areaTax={this.state.listing.areaTax}
                  cleaningFee={this.state.listing.cleaningFee}
                  price={this.state.listing.price}
                />
              </div>
              <div className="booking-footer-parent">
                <div className="footer-button-spacing">
                  <BookingFooter
                    isFetchingPricingQuote={this.state.isFetchingPricingQuote}
                    onSubmit={this.onSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>Loading...</div>
    );
  }
}

export default Booking;
