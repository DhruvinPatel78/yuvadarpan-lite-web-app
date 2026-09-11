import * as React from "react";
import { Grid, styled, TextField, Autocomplete } from "@mui/material";
import { fieldControlCss } from "../UI/fieldStyles";

const PrimaryAutocomplete = styled(Autocomplete)`
  ${fieldControlCss}
  & .MuiSvgIcon-root {
    color: #542b2b;
  }
  & .MuiInputBase-input {
    color: #542b2b;
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
  disablePortal = false,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        disabled={disabled}
        disablePortal={disablePortal}
        componentsProps={{
          popper: {
            sx: { zIndex: 2000 },
          },
        }}
        defaultValue={defaultValue}
        options={list}
        value={
          multiple
            ? value || []
            : value === "" || value === undefined
              ? null
              : value
        }
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : option?.label || option?.name || ""
        }
        isOptionEqualToValue={(option, value) => {
          if (!value) return false;
          return (
            option.label === value.label ||
            option.id === value.id ||
            option.label === value
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
            value={value}
            error={errors}
            onBlur={onBlur}
          />
        )}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={onBlur}
        required
        disableClearable={true}
        limitTags={limitTags}
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
