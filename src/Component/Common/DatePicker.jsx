import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Grid, styled } from "@mui/material";
import dayjs from "dayjs";
const PrimaryDateTimePicker = styled(DateTimePicker)`
  & label.Mui-focused {
    color: #572a2a;
  }
  & .MuiFormLabel-root {
    color: #572a2a !important;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #572a2a;
    }
  }
  & .MuiFilledInput-root:after {
    border-color: #572a2a;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: #572a2a !important;
  }
  //& .Mui-focused {
  //  border-color: #572a2a !important;
  //}
`;

const DatePicker = ({
  label,
  value,
  onChange,
  placeholder,
  name,
  focused,
  errors,
  onBlur,
  required = true,
  ...rest
}) => {
  return (
    <Grid item {...rest}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PrimaryDateTimePicker
          fullWidth
          value={dayjs(value)}
          label={label}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
          className={"w-full"}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errors?"red !important":"#572a2a !important",
            }
          }}
        />
      </LocalizationProvider>
      {errors && (
        <div className={"text-error text-sm transition-all"}>{errors}</div>
      )}
    </Grid>
  );
};

export default DatePicker;
