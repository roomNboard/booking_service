import React, { Component } from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const moment = extendMoment(Moment);

const calendarDefaults = {
  displayFormat: 'MM/DD/YYYY',
  numberOfMonths: 1,
  startDateId: 'checkin',
  startDatePlaceholderText: 'Check In',
  endDateId: 'checkout',
  endDatePlaceholderText: 'Check Out',
  hideKeyboardShortcutsPanel: true,
  blockLayout: true,
};

class BookingCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: this.props.focusedDateInput,
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleInvalidDateChange = this.handleInvalidDateChange.bind(this);
  }

  handleDateChange(startDate, endDate) {
    if (startDate && !endDate) {
      return true;
    } else if (startDate && endDate) {
      const selected = moment.range(startDate, endDate);
      const unavailable = this.props.bookedDates;
      let checkSelected = true;
      unavailable.forEach((booking) => {
        if (selected.overlaps(booking)) {
          checkSelected = false;
        }
      });
      return checkSelected;
    }
    return false;
  }

  handleValidDateChange() {
    this.props.setTripDates(this.state.startDate, this.state.endDate);
  }

  handleInvalidDateChange() {
    this.setState({
      startDate: null,
      endDate: null,
    }, () => {
      this.props.setTripDates(null, null);
    });
  }

  render() {
    const blockedDates = this.props.bookedDates.reduce((acc, current) => {
      const dayRange = Array.from(current.by('day'));
      return acc.concat(dayRange);
    }, []);

    const isDayBlocked = day => blockedDates.filter(d => d.isSame(day, 'day')).length > 0;

    return (
      <div className="calendar-outer-container">
        <div className="calendar-inner-container">
          <DateRangePicker
            displayFormat={calendarDefaults.displayFormat}
            startDate={this.state.startDate}
            startDateId={calendarDefaults.startDateId}
            startDatePlaceholderText={calendarDefaults.startDatePlaceholderText}
            endDate={this.state.endDate}
            endDateId={calendarDefaults.endDateId}
            endDatePlaceholderText={calendarDefaults.endDatePlaceholderText}
            onDatesChange={({ startDate, endDate }) => {
              const availabilityCheckResult = this.handleDateChange(startDate, endDate);
              if (availabilityCheckResult) {
                this.setState({ startDate, endDate }, () => {
                  this.handleValidDateChange();
                });
              } else {
                this.handleInvalidDateChange();
              }
            }}
            focusedInput={this.props.focusedDateInput}
            onFocusChange={focusedInput => this.props.handleFocusChange(focusedInput)}
            numberOfMonths={calendarDefaults.numberOfMonths}
            hideKeyboardShortcutsPanel={calendarDefaults.hideKeyboardShortcutsPanel}
            block={calendarDefaults.blockLayout}
            isDayBlocked={isDayBlocked}
          />
        </div>
      </div>
    );
  }
}

export default BookingCalendar;
