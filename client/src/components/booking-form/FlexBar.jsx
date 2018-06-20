import React from 'react';

const chevronDownSVG = 'm 16.29 4.3 a 1 1 0 1 1 1.41 1.42 l -8 8 a 1 1 0 0 1 -1.41 ' +
'0 l -8 -8 a 1 1 0 1 1 1.41 -1.42 l 7.29 7.29 Z';

const chevronUpSVG = 'm 1.71 13.71 a 1 1 0 1 1 -1.42 -1.42 l 8 -8 a 1 1 0 0 1 ' +
'1.41 0 l 8 8 a 1 1 0 1 1 -1.41 1.42 l -7.29 -7.29 Z';

const IconChevronDown = props => (
  <svg viewBox="0 0 18 18" role="presentation" focusable="false" className="icon-chevron">
    <path d={chevronDownSVG} fillRule="evenodd" />
  </svg>
);

const IconChevronUp = props => (
  <svg viewBox="0 0 18 18" role="presentation" focusable="false" className="icon-chevron">
    <path d={chevronUpSVG} fillRule="evenodd" />
  </svg>
);

const FlexBarTextContent = ({ guestDetails, renderChildTag }) => (
  renderChildTag ? (
    <div className="flexbar-content-text">
      <span className="guest-label">
        <span className="guest-label-text">guests {guestDetails.adults}</span>
      </span>
      <span className="guest-label">
        <span className="guest-label-text">children {guestDetails.children}</span>
      </span>
    </div>
  ) : (
    <div className="flexbar-content-text">
      <span className="guest-label">
        <span className="guest-label-text">guests {guestDetails.adults}</span>
      </span>
    </div>
  )
);

const FlexBarTextContentHighlight = ({ guestDetails, renderChildTag }) => (
  renderChildTag ? (
    <div className="flexbar-content-text">
      <span className="guest-label">
        <span className="guest-label-text text-highlight">guests {guestDetails.adults}</span>
      </span>
      <span className="guest-label">
        <span className="guest-label-text text-highlight">children {guestDetails.children}</span>
      </span>
    </div>
  ) : (
    <div className="flexbar-content-text">
      <span className="guest-label">
        <span className="guest-label-text text-highlight">guests {guestDetails.adults}</span>
      </span>
    </div>
  )
);

const FlexBar = ({ isFocused, guestDetails, renderChildTag }) => (
  isFocused ? (
    <div className="flexbar-content-container">
      <FlexBarTextContentHighlight
        guestDetails={guestDetails}
        renderChildTag={renderChildTag}
      />
      <div className="flexbar-content-icon">
        <IconChevronUp />
      </div>
    </div>
  ) : (
    <div className="flexbar-content-container">
      <FlexBarTextContent
        guestDetails={guestDetails}
        renderChildTag={renderChildTag}
      />
      <div className="flexbar-content-icon">
        <IconChevronDown />
      </div>
    </div>
  )
);

export default FlexBar;
