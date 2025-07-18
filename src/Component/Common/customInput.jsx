import React from "react";
import { Grid, IconButton, styled, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  & .Mui-focused,
  .MuiFormLabel-root {
    color: #572a2a !important;
  }
  & .Mui-disabled {
    opacity: 0.5;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: #572a2a !important;
  }
  & .Mui-error {
    &.Mui-focused fieldset {
      //border-color: #572a2a;
      border-color: #ff0000 !important;
    }
    & .MuiOutlinedInput-notchedOutline {
      border-color: #ff0000 !important;
    }
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
  disabled = false,
  onBlur,
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <Grid item {...rest}>
      <PrimaryTextField
        type={showPassword ? "text" : type}
        label={label}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        fullWidth
        multiline={multiline}
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
                <VisibilityOff sx={{ color: "#572a2a" }} />
              ) : (
                <Visibility sx={{ color: "#572a2a" }} />
              )}
            </IconButton>
          ),
        }}
        required={required}
        focused={focused}
        onBlur={onBlur}
        disabled={disabled}
        error={errors}
        {...(type === "date" ? { max: today } : {})}
      />
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
};

export default CustomInput;
