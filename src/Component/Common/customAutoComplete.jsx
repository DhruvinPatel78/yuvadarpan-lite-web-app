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
  & .MuiChip-label {
    max-width: 100px;
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
  limitTags = 2,
  required = true,
  multiple = false,
  ...rest
}) {
  const optionsSafe = Array.isArray(list) ? list : [];
  const valueSafe = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ?? null);
  const defaultValueSafe = multiple
    ? (Array.isArray(defaultValue) ? defaultValue : [])
    : (defaultValue ?? null);
  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        disabled={disabled}
        defaultValue={defaultValueSafe}
        options={optionsSafe}
        value={valueSafe}
        getOptionLabel={(option) => {
          if (option == null) return "";
          if (typeof option === "string") return option;
          return option.label ?? option.name ?? String(option?.value ?? "");
        }}
        isOptionEqualToValue={(option, value) => {
          if (!option || !value) return false;
          if (typeof option === "string" || typeof value === "string") {
            return option === value;
          }
          return (
            option.label === value.label ||
            option.id === value.id ||
            option.value === value.value
          );
        }}
        multiple={multiple}
        id={`autoComplete-${name}`}
        label={label}
        name={name}
        className={className}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            label={label}
            value={valueSafe}
            error={errors}
            onBlur={onBlur}
          />
        )}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disableClearable={!multiple}
        limitTags={limitTags}
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
