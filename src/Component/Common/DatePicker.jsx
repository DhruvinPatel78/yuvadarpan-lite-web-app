import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Grid, styled } from "@mui/material";
import dayjs from "dayjs";
import { fieldControlCss } from "../UI/fieldStyles";

const PrimaryDateTimePicker = styled(DateTimePicker)`
  ${fieldControlCss}
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
  xs,
  sm,
  md,
  lg,
  xl,
}) => {
  const parsedValue = value ? dayjs(value) : null;
  const pickerValue =
    parsedValue && parsedValue.isValid() ? parsedValue : null;
  const showError = Boolean(errors) && !pickerValue;

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PrimaryDateTimePicker
          className={"w-full"}
          value={pickerValue}
          label={label}
          onChange={onChange}
          ampm
          desktopModeMediaQuery="@media (min-width: 768px)"
          slotProps={{
            textField: {
              name,
              fullWidth: true,
              required,
              focused,
              placeholder,
              error: showError,
              onBlur,
              className: "w-full",
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: showError ? "red !important" : "#d2c8c2 !important",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
      {showError ? (
        <div className={"text-error text-sm transition-all"}>{errors}</div>
      ) : null}
    </Grid>
  );
};

export default DatePicker;
