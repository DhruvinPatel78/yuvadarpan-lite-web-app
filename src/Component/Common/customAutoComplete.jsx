import * as React from "react";
import { Grid, styled, TextField, Autocomplete } from "@mui/material";
import { fieldControlCss } from "../UI/fieldStyles";
import { masterNameText, matchesLangQuery } from "../../util/bhasha";
import { useFormLanguage } from "../../context/FormLanguageContext";

const optionIdOf = (option) => {
  if (option == null || option === "") return "";
  if (typeof option !== "object") return String(option);
  const id = option.uuid || option.id || option.value || option._id;
  return id == null ? "" : String(id);
};

const resolveOption = (list, value) => {
  if (value == null || value === "") return null;
  const rows = Array.isArray(list) ? list : [];
  if (typeof value === "object") {
    const selectedId = optionIdOf(value);
    if (selectedId) {
      return rows.find((item) => optionIdOf(item) === selectedId) || value;
    }
    const label = masterNameText(value);
    return (
      rows.find((item) => masterNameText(item) === label) ||
      value
    );
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
  disablePortal = false,
  open,
  onOpen,
  onClose,
  openOnFocus = false,
  autoHighlight = true,
  autoComplete = false,
  autoSelect = false,
  clearOnBlur = false,
  onMouseDown,
  ...rest
}) {
  const { language } = useFormLanguage();
  const optionLabel = React.useCallback(
    (option) => {
      if (option == null || option === "") return "";
      if (typeof option === "string") return option;
      return masterNameText(option, language) || String(option.label || "");
    },
    [language]
  );
  const options = React.useMemo(
    () => (Array.isArray(list) ? list : []),
    [list]
  );
  const selected = multiple ? value || [] : resolveOption(options, value);
  const hasValue = multiple
    ? (Array.isArray(selected) ? selected.length > 0 : false)
    : Boolean(selected);
  const showError = Boolean(errors) && !hasValue;

  return (
    <Grid item {...rest}>
      <PrimaryAutocomplete
        disabled={disabled}
        disablePortal={disablePortal}
        autoHighlight={autoHighlight}
        autoComplete={autoComplete}
        autoSelect={multiple ? false : autoSelect}
        blurOnSelect={multiple ? false : "touch"}
        clearOnBlur={multiple ? false : clearOnBlur}
        openOnFocus={openOnFocus}
        onMouseDown={onMouseDown}
        {...(open !== undefined ? { open, onOpen, onClose } : { onOpen, onClose })}
        filterSelectedOptions={multiple}
        filterOptions={(options, state) => {
          const rows = Array.isArray(options) ? options : [];
          const query = state?.inputValue;
          if (!String(query || "").trim()) {
            return rows;
          }
          return rows.filter((option) => matchesLangQuery(option, query));
        }}
        componentsProps={{
          popper: {
            sx: {
              zIndex: 1500,
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
        options={options}
        value={selected}
        getOptionLabel={optionLabel}
        isOptionEqualToValue={(option, selectedOption) => {
          if (!option || selectedOption == null || selectedOption === "") {
            return false;
          }
          const optionId = optionIdOf(option);
          const selectedId = optionIdOf(selectedOption);
          if (optionId && selectedId) {
            return optionId === selectedId;
          }
          return optionLabel(option) === optionLabel(selectedOption);
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
            error={showError}
            onBlur={onBlur}
            required={Boolean(required)}
            InputLabelProps={{
              ...params.InputLabelProps,
              shrink: label && hasValue ? true : params.InputLabelProps?.shrink,
            }}
            inputProps={{
              ...params.inputProps,
              autoComplete: "off",
              // Multi-select stores chips, not input text — native required would always fail.
              ...(multiple ? { required: false } : null),
            }}
          />
        )}
        onSelect={onSelect}
        onChange={(event, nextValue, reason, details) => {
          onChange?.(event, nextValue, reason, details);
        }}
        onBlur={onBlur}
        disableClearable={multiple}
        limitTags={limitTags}
      />
      {showError ? (
        <p className={"text-error text-sm"}>{errors}</p>
      ) : null}
    </Grid>
  );
}
