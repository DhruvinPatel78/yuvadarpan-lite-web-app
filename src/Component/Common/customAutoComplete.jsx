import * as React from "react";
import { Grid, styled, TextField, Autocomplete } from "@mui/material";
import { fieldControlCss } from "../UI/fieldStyles";
import { masterNameText } from "../../util/bhasha";
import { useFormLanguage } from "../../context/FormLanguageContext";

const optionIdOf = (option) => {
  if (option == null || option === "") return "";
  if (typeof option !== "object") return String(option);
  const id = option.uuid ?? option.id ?? option.value ?? option._id;
  return id == null ? "" : String(id);
};

const optionMatchesQuery = (option, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  return (
    masterNameText(option, "en").toLowerCase().includes(q) ||
    masterNameText(option, "gu").toLowerCase().includes(q)
  );
};

const resolveOption = (list, value) => {
  if (value == null || value === "") return null;
  const rows = Array.isArray(list) ? list : [];
  if (typeof value === "object") {
    const selectedId = optionIdOf(value);
    return rows.find((item) => optionIdOf(item) === selectedId) || value;
  }
  const key = String(value);
  return (
    rows.find((item) => optionIdOf(item) === key) ||
    rows.find(
      (item) =>
        masterNameText(item, "en") === key || masterNameText(item, "gu") === key
    ) ||
    null
  );
};

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
  open,
  onOpen,
  onClose,
  openOnFocus = false,
  autoHighlight = true,
  autoComplete = true,
  onMouseDown,
  ...rest
}) {
  const { language } = useFormLanguage();
  const optionLabel = (option) => {
    if (option == null || option === "") return "";
    if (typeof option === "string") return option;
    return masterNameText(option, language) || String(option.label || "");
  };
  const selected = multiple ? value || [] : resolveOption(list, value);

  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        key={`${name}-${language}`}
        disabled={disabled}
        disablePortal={disablePortal}
        autoHighlight={autoHighlight}
        autoComplete={autoComplete}
        openOnFocus={openOnFocus}
        onMouseDown={onMouseDown}
        {...(open !== undefined ? { open, onOpen, onClose } : { onOpen, onClose })}
        includeInputInList
        filterSelectedOptions={multiple}
        filterOptions={(options, state) =>
          (Array.isArray(options) ? options : []).filter((option) =>
            optionMatchesQuery(option, state.inputValue)
          )
        }
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
        value={selected}
        getOptionLabel={optionLabel}
        isOptionEqualToValue={(option, selected) =>
          Boolean(option) &&
          selected != null &&
          selected !== "" &&
          optionIdOf(option) === optionIdOf(selected)
        }
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
            InputLabelProps={{
              ...params.InputLabelProps,
              ...((multiple ? (value || []).length : value != null && value !== "")
                ? { shrink: true }
                : null),
            }}
            inputProps={{
              ...params.inputProps,
              autoComplete: "off",
            }}
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
