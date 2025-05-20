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
  & .MuiOutlinedInput-notchedOutline {
    border-color: #572a2a !important;
  }
  //& .Mui-focused {
  //  border-color: #572a2a !important;
  //}
  & .Mui-disabled {
    opacity: 0.5;
  }
  & .Mui-error {
    &.Mui-focused fieldset {
      border-color: #ff0000 !important;
    }
    & .MuiOutlinedInput-notchedOutline {
      border-color: #ff0000 !important;
    }
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
  onSelect,
  onBlur,
  required = true,
  multiple = false,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        disabled={disabled}
        defaultValue={defaultValue}
        options={list}
        value={value}
        isOptionEqualToValue={(option, value) =>
          option.label === value || option.id === value
        }
        multiple={multiple}
        id={`autoComplete-${name}`}
        label={label}
        name={name}
        className={className}
        renderInput={(params) => (
          <TextField {...params} name={name} label={label} value={value} error={errors} onBlur={onBlur} />
        )}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={onBlur}
        required
        disableClearable={true}
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
