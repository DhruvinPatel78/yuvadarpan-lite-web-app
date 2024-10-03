import * as React from "react";
import { Grid, styled, TextField, Autocomplete } from "@mui/material";

const PrimaryAutocomplete = styled(Autocomplete)`
  & .MuiAutocomplete-root {
    color: #572a2a;
  }
  & .MuiSvgIcon-root {
    color: #572a2a;
  }
  & .MuiInputBase-input {
    color: #572a2a;
  }
  & .Mui-focused,
  .MuiFormLabel-root {
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
`;
export default function CustomAutoComplete({
  label,
  list,
  className,
  placeholder,
  name,
  value,
  errors,
  defaultValue,
  disabled,
  onChange,
  onBlur,
  required = true,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        disabled={disabled}
        defaultValue={defaultValue}
        id={`combo-box-${label}`}
        label={label}
        name={name}
        options={list}
        className={className}
        renderInput={(params) => (
          <TextField {...params} name={name} label={label} />
        )}
        onSelect={onChange}
        onBlur={onBlur}
        required
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
