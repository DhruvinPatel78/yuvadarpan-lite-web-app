import * as React from "react";
import {
  Grid,
  styled,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const PrimaryCheckbox = styled(Checkbox)`
  & .MuiSvgIcon-root {
    color: #572a2a;
  }
  &.Mui-Checked {
    color: #572a2a;
  }
`;
export default function CustomCheckbox({
  label,
  list,
  name,
  value,
  errors,
  onChange,
  className,
  onBlur,
  required = true,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <FormControl className={"flex flex-row justify-start items-center"}>
        <FormLabel
          id={`demo-controlled-checkbox-${name}`}
          className={"text-primary"}
        >
          {label}
        </FormLabel>
        <PrimaryCheckbox
          aria-labelledby={`demo-controlled-checkbox-${name}`}
          name={name}
          value={value}
          onChange={onChange}
          // required
          className={className}
          onBlur={onBlur}
          checked={value}
        >
          <FormControlLabel
            key={`checkbox`}
            value={value}
            control={<Checkbox />}
            label={label}
          />
        </PrimaryCheckbox>
      </FormControl>
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
