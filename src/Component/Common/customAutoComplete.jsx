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
  disablePortal = true,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        disabled={disabled}
        disablePortal={disablePortal}
        autoHighlight
        autoComplete
        includeInputInList
        filterSelectedOptions={multiple}
        componentsProps={{
          popper: {
            sx: {
              zIndex: 20,
              width: "100%",
              "@media (max-width: 767.95px)": {
                maxWidth: "calc(100vw - 24px)",
              },
            },
          },
          paper: {
            sx: {
              maxHeight: 280,
            },
          },
        }}
        ListboxProps={{
          sx: {
            maxHeight: 240,
          },
        }}
        defaultValue={defaultValue}
        options={Array.isArray(list) ? list : []}
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
        isOptionEqualToValue={(option, selected) => {
          if (!option || selected == null || selected === "") return false;
          if (typeof selected === "string") {
            return (
              option.label === selected ||
              option.name === selected ||
              String(option.id) === selected ||
              String(option.value) === selected
            );
          }
          return (
            String(option.id) === String(selected.id) ||
            String(option.value) === String(selected.value) ||
            option.label === selected.label ||
            option.name === selected.name
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
            placeholder={placeholder}
            error={Boolean(errors)}
            onBlur={onBlur}
            required={Boolean(required)}
          />
        )}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={onBlur}
        disableClearable={multiple}
        limitTags={limitTags}
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
