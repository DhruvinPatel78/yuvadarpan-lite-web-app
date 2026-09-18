import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Grid, styled, Select, Typography } from "@mui/material";
import { fieldControlCss } from "../UI/fieldStyles";

const PrimarySelect = styled(Select)`
  ${fieldControlCss}
  & .MuiSvgIcon-root {
    color: #542b2b !important;
  }
`;

export default function CustomSelect({
  list,
  label,
  placeholder,
  name,
  value,
  errors,
  onChange,
  onBlur,
  required = false,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const onMouseDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <Grid item {...rest}>
      <FormControl
        className={"w-full"}
        ref={rootRef}
        sx={{ position: "relative" }}
      >
        <InputLabel
          className={"text-primary"}
          color="primary"
          id={`select-helper-${name}`}
        >
          {label}
        </InputLabel>
        <PrimarySelect
          labelId={`select-helper-${name}`}
          id={`select-${name}`}
          placeholder={placeholder}
          value={value ?? ""}
          label={label}
          name={name}
          onChange={onChange}
          fullWidth
          required={required}
          onBlur={onBlur}
          displayEmpty
          autoFocus={false}
          renderValue={(selected) => {
            if (selected === "" || selected == null) {
              return placeholder || "Select";
            }
            const match = (Array.isArray(list) ? list : []).find((data) => {
              if (data && typeof data === "object") {
                return (
                  String(data.value) === String(selected) ||
                  String(data.id) === String(selected)
                );
              }
              return data === selected;
            });
            if (match && typeof match === "object") {
              return match.label || match.name || selected;
            }
            return match ?? selected;
          }}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          MenuProps={{
            disablePortal: true,
            disableScrollLock: true,
            BackdropProps: {
              sx: { display: "none" },
            },
            PaperProps: {
              sx: {
                maxHeight: 280,
                width: "100%",
                position: "absolute !important",
                left: "0 !important",
                top: "4px !important",
                transform: "none !important",
              },
            },
            sx: {
              position: "absolute !important",
              left: "0 !important",
              top: "100% !important",
              width: "100%",
              transform: "none !important",
              zIndex: 20,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errors ? "red !important" : "#d2c8c2 !important",
            }
          }}
        >
          <MenuItem value="">{placeholder || "SELECT"}</MenuItem>
          {(Array.isArray(list) ? list : []).map((data) => {
            const isObject = data && typeof data === "object";
            const optionValue = isObject
              ? String(data.value ?? data.id ?? "")
              : data;
            const optionLabel = isObject
              ? data.label || data.name || optionValue
              : data;
            return (
              <MenuItem key={String(optionValue)} value={optionValue}>
                <Typography className={isObject ? undefined : "uppercase"}>
                  {optionLabel}
                </Typography>
              </MenuItem>
            );
          })}
        </PrimarySelect>
        {errors && (
          <p className={"text-error text-sm transition-all"}>{errors}</p>
        )}
      </FormControl>
    </Grid>
  );
}
