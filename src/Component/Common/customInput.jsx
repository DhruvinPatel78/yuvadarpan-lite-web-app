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
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
};

export default CustomInput;
