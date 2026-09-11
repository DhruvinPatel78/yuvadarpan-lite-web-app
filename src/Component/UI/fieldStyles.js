export const fieldControlCss = `
  & .MuiOutlinedInput-root {
    border-radius: 8px;
    background-color: #fff;
    min-height: 44px;
    &.Mui-focused fieldset {
      border-color: #542b2b;
    }
  }
  & .MuiFilledInput-root:after {
    border-color: #542b2b;
  }
  & .Mui-focused,
  .MuiFormLabel-root {
    color: #542b2b !important;
  }
  & label.Mui-focused {
    color: #542b2b;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: #d7d0c8 !important;
  }
  & .Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #542b2b !important;
  }
  & .Mui-disabled {
    opacity: 0.5;
  }
  & .Mui-error {
    &.Mui-focused fieldset {
      border-color: #dc2626 !important;
    }
    & .MuiOutlinedInput-notchedOutline {
      border-color: #dc2626 !important;
    }
  }
  & input:-webkit-autofill,
  & input:-webkit-autofill:hover,
  & input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #fff inset;
    -webkit-text-fill-color: #542b2b;
    caret-color: #542b2b;
    transition: background-color 9999s ease-out 0s;
  }
  & input[type="date"] {
    color-scheme: light;
    min-height: 24px;
  }
  & input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.55;
  }
`;
