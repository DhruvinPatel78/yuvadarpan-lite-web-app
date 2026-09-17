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
          value={value}
          label={label}
          name={name}
          onChange={onChange}
          fullWidth
          required={required}
          onBlur={onBlur}
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
          <MenuItem value="">SELECT</MenuItem>
          {list.map((data) => (
            <MenuItem key={data} value={data}>
              <Typography className={"uppercase"}>{data}</Typography>
            </MenuItem>
          ))}
        </PrimarySelect>
        {errors && (
          <p className={"text-error text-sm transition-all"}>{errors}</p>
        )}
      </FormControl>
    </Grid>
  );
}
