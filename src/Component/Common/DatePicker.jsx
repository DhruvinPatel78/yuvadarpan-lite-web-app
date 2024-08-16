import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {Grid, styled, TextField} from "@mui/material";

const PrimaryDateTimePicker = styled(DateTimePicker)`
  & label.Mui-focused {
    color: #572a2a;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #572a2a;
    }
  }
  & .MuiFilledInput-root:after {
    border-color: #572a2a;
  }
`;

const DatePicker = ({
  label,
  value,
  onChange,
  placeholder,
  name,
  focused,
  errors,
  required = true,
  ...rest
}) => {
  return (
    <Grid item {...rest}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PrimaryDateTimePicker fullWidth label={label} {...rest} className={'w-full'} />
      </LocalizationProvider>
    </Grid>
  );
};

export default DatePicker;
