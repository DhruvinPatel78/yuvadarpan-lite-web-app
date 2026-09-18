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
  onBlur,
  id,
  max,
  min,
  inputProps,
  InputLabelProps,
  autoFocus = false,
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

  return (
    <Grid item {...rest}>
      <PrimaryTextField
        id={id}
        type={showPassword ? "text" : type}
        label={label}
        placeholder={placeholder}
        name={name}
        autoComplete={
          type === "tel" ? "tel" : type === "password" ? "new-password" : "off"
        }
        onChange={onChange}
        value={
          isDate && value
            ? String(value).match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || ""
            : value
        }
        fullWidth
        multiline={multiline}
        InputLabelProps={
          isDate ? { shrink: true, ...InputLabelProps } : InputLabelProps
        }
        InputProps={{
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
        autoFocus={autoFocus}
        focused={isDate ? undefined : focused}
        onBlur={onBlur}
        disabled={disabled}
        error={Boolean(errors)}
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
          ...inputProps,
        }}
      />
      {errors ? (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      ) : null}
    </Grid>
  );
};

export default CustomInput;
