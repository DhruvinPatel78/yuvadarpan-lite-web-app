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
    color: #542b2b;
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
  onBlur,
  required = true,
  ...rest
}) {
  return (
    <Grid item {...rest}>
      <FormControl>
        <FormLabel
          id={`demo-controlled-radio-buttons-group-${name}`}
          className={"!text-primary !text-sm !font-semibold"}
        >
          {label}
        </FormLabel>
        <PrimaryRadioGroup
          aria-labelledby={`demo-controlled-radio-buttons-group-${name}`}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={className}
          onBlur={onBlur}
        >
          {list.map((data, index) => {
            const selected = value === data.value;
            return (
              <FormControlLabel
                key={`radio-${index}`}
                value={data.value}
                control={<Radio size="small" />}
                label={data.label}
                sx={{
                  m: 0,
                  mr: 1,
                  mt: 0.25,
                  pr: 1.25,
                  pl: 0.25,
                  borderRadius: "999px",
                  backgroundColor: selected ? "#f4ebe6" : "transparent",
                }}
              />
            );
          })}
        </PrimaryRadioGroup>
      </FormControl>
      {errors ? (
        <p className={"text-error text-sm transition-all"}>{errors}</p>
      ) : null}
    </Grid>
  );
}
