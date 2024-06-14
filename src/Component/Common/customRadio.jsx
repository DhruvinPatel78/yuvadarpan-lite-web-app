import * as React from "react";
import {
  Grid,
  styled,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const PrimaryRadioGroup = styled(RadioGroup)`
  & .MuiSvgIcon-root {
    color: #572a2a;
  }
`;
export default function CustomRadio({
  label,
  list,
  name,
  value,
  errors,
  onChange,
    className,
  required = true,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <FormControl>
        <FormLabel id={`demo-controlled-radio-buttons-group-${name}`} className={"text-primary"}>
          {label}
        </FormLabel>
        <PrimaryRadioGroup
          aria-labelledby={`demo-controlled-radio-buttons-group-${name}`}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={className}
        >
          {list.map((data, index) => {
            return (
              <FormControlLabel
                key={`radio-${index}`}
                value={data.value}
                control={<Radio />}
                label={data.label}
              />
            );
          })}
        </PrimaryRadioGroup>
      </FormControl>
      {errors && (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      )}
    </Grid>
  );
}
