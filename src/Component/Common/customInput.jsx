import React from "react";
import { Grid, styled, TextField } from "@mui/material";
const PrimaryTextField = styled(TextField)`
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
  & .Mui-focused,
  .MuiFormLabel-root {
    color: #572a2a !important;
  }
  & .Mui-disabled {
    opacity: 0.5;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: #572a2a !important;
  }
  & .Mui-error {
    &.Mui-focused fieldset {
      //border-color: #572a2a;
      border-color: #ff0000 !important;
    }
    & .MuiOutlinedInput-notchedOutline {
      border-color: #ff0000 !important;
    }
  }
  //& .Mui-focused {
  //  border-color: #572a2a !important;
  //}
`;
const CustomInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  name,
  focused,
  errors,
  multiline,
  required = false,
  disabled = false,
  onBlur,
  ...rest
}) => {
  return (
    <Grid item {...rest}>
      <PrimaryTextField
        type={type}
        label={label}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        fullWidth
        multiline={multiline}
        InputProps={{
          rows: 5,
        }}
        required={required}
        focused={focused}
        onBlur={onBlur}
        disabled={disabled}
        error={errors}
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
};

export default CustomInput;
