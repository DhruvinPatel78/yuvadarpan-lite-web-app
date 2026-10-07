import React from "react";
import { Grid, IconButton, styled, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fieldControlCss } from "../UI/fieldStyles";

const PrimaryTextField = styled(TextField)`
  ${fieldControlCss}
`;

const localToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

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
  readOnly = false,
  onBlur,
  id,
  max,
  min,
  inputProps,
  InputLabelProps,
  autoFocus = false,
  inputRef,
  uncontrolled = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const isDate = type === "date";
  const displayValue =
    value && typeof value === "object" && !Array.isArray(value)
      ? String(value.en || value.gu || value.name || "")
      : value;
  const filled =
    isDate || (displayValue != null && String(displayValue).trim() !== "");
  const showError = Boolean(errors) && !filled;
  const locked = Boolean(disabled || readOnly);

  return (
    <Grid item {...rest}>
      <PrimaryTextField
        id={id}
        inputRef={inputRef}
        type={showPassword ? "text" : type}
        label={label}
        placeholder={placeholder}
        name={name}
        autoComplete={
          type === "tel" ? "tel" : type === "password" ? "new-password" : "off"
        }
        onChange={uncontrolled || locked ? undefined : onChange}
        defaultValue={uncontrolled ? displayValue : undefined}
        value={
          uncontrolled
            ? undefined
            : isDate && displayValue
            ? String(displayValue).match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || ""
            : displayValue
        }
        fullWidth
        multiline={multiline}
        InputLabelProps={{
          ...InputLabelProps,
          ...(label && filled ? { shrink: true } : null),
        }}
        InputProps={{
          notched: label && filled ? true : undefined,
          readOnly: locked,
          rows: 5,
          endAdornment: type === "password" && (
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "display the password"
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOff sx={{ color: "#542b2b" }} />
              ) : (
                <Visibility sx={{ color: "#542b2b" }} />
              )}
            </IconButton>
          ),
        }}
        required={required}
        autoFocus={readOnly ? false : autoFocus}
        focused={readOnly ? false : isDate ? undefined : focused}
        onBlur={onBlur}
        disabled={disabled && !readOnly}
        error={showError}
        onMouseDown={
          readOnly
            ? (event) => {
                event.preventDefault();
              }
            : undefined
        }
        sx={
          locked
            ? {
                opacity: "1 !important",
                pointerEvents: readOnly ? "none" : undefined,
                "& .MuiOutlinedInput-root": {
                  cursor: "default",
                  backgroundColor: "#efe8e0 !important",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  opacity: "1 !important",
                },
                "& .MuiOutlinedInput-root:hover": {
                  backgroundColor: "#efe8e0 !important",
                },
                "& .MuiOutlinedInput-root.Mui-disabled": {
                  opacity: "1 !important",
                  backgroundColor: "#efe8e0 !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ddd4cb !important",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#ddd4cb !important",
                    borderWidth: "1px !important",
                  },
                "& .MuiOutlinedInput-input, & .MuiInputBase-input": {
                  cursor: "default",
                  color: "#6b5555 !important",
                  WebkitTextFillColor: "#6b5555 !important",
                  opacity: "1 !important",
                },
                "& .MuiInputLabel-root": {
                  color: "#8a7870 !important",
                  opacity: "1 !important",
                  backgroundColor: "transparent",
                },
                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.Mui-disabled":
                  {
                    color: "#8a7870 !important",
                    opacity: "1 !important",
                    backgroundColor: "transparent",
                  },
              }
            : undefined
        }
        inputProps={{
          ...(type === "number" ? { inputMode: "numeric" } : {}),
          ...(type === "tel"
            ? {
                inputMode: "numeric",
                maxLength: 10,
                autoComplete: "tel",
                pattern: "[0-9]*",
              }
            : {}),
          ...(isDate ? { max: max || localToday(), min } : {}),
          ...(!isDate && min != null ? { min } : {}),
          ...(!isDate && max != null ? { max } : {}),
          ...(readOnly
            ? {
                readOnly: true,
                tabIndex: -1,
              }
            : {}),
          ...inputProps,
        }}
      />
      {showError ? (
        <p className={"text-error text-sm"}>{errors}</p>
      ) : null}
    </Grid>
  );
};

export default CustomInput;
