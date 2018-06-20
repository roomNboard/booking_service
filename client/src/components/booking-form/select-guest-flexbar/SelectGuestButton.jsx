import React from 'react';

const buttonDisabledStyle = {
  isDisabled: 'button-guest-select-icon disabled',
  notDisabled: 'button-guest-select-icon',
};

const MinusSignSVG = ({ disabled }) => (
  <span className={disabled ? buttonDisabledStyle.isDisabled : buttonDisabledStyle.notDisabled}>
    <svg viewBox="0 0 24 24" role="img" focusable="false" className="button-guest-select-svg">
      <rect height="2" rx="1" width="12" x="6" y="11" fill="currentcolor" />
    </svg>
  </span>
);

const PlusSignSVG = ({ disabled }) => (
  <span className={disabled ? buttonDisabledStyle.isDisabled : buttonDisabledStyle.notDisabled}>
    <svg viewBox="0 0 24 24" role="img" focusable="false" className="button-guest-select-svg">
      <rect height="2" rx="1" width="12" x="6" y="11" fill="currentcolor" />
      <rect height="12" rx="1" width="2" x="11" y="6" fill="currentcolor" />
    </svg>
  </span>
);

const SelectGuestButton = ({ side, disabled, guestType, updateGuestDetails }) => (
  side ? (
    <button
      className="button-guest-select"
      disabled={disabled}
      onClick={() => {
        updateGuestDetails(side, disabled, guestType);
      }}
    >
      <MinusSignSVG
        disabled={disabled}
      />
    </button>
  ) : (
    <button
      className="button-guest-select"
      disabled={disabled}
      onClick={() => {
        updateGuestDetails(side, disabled, guestType);
      }}
    >
      <PlusSignSVG
        disabled={disabled}
      />
    </button>
  )
);

export default SelectGuestButton;
