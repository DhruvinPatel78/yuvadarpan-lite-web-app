import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Grid, styled, Select, Typography } from "@mui/material";

const PrimarySelect = styled(Select)`
  & .MuiSelect-root {
    color: #572a2a;
  }
  & .MuiSelect-root,
  .MuiFormLabel-root-MuiInputLabel-root .Mui-focused {
    color: #572a2a !important;
  }

  & .MuiSvgIcon-root {
    color: #572a2a;
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
  return (
    <Grid item {...rest}>
      <FormControl className={"w-full"}>
        <InputLabel id={`select-helper-${name}`}>{label}</InputLabel>
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
        >
          <MenuItem>SELECT</MenuItem>
          {list.map((data) => (
            <MenuItem value={data}>
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
