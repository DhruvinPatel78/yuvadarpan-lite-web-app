import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {
  Grid,
  styled,
  Select,
  Typography,
  FormHelperText,
} from "@mui/material";

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
  //& .MuiInputBase-input {
  //  color: #572a2a;
  //}
  //& .MuiFormLabel-root {
  //  color: #572a2a !important;
  //}
  //
  //& .MuiOutlinedInput-root {
  //  &.Mui-focused fieldset {
  //    border-color: #572a2a;
  //  }
  //}
  //& .MuiFilledInput-root:after {
  //  border-color: #572a2a;
  //}
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
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {list.map((data) => (
            <MenuItem value={data}>
              <Typography>{data}</Typography>
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
