import * as React from "react";
import { Grid, styled, TextField, Autocomplete } from "@mui/material";

const PrimaryAutocomplete = styled(Autocomplete)`
  & .MuiAutocomplete-root {
    color: #572a2a;
  }
  & .MuiSvgIcon-root {
    color: #572a2a;
  }
    & .MuiInputBase-input {
        color: #572a2a
    }
  & .Mui-focused,
  .MuiFormLabel-root {
    color: #572a2a !important;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #572a2a;
    }
  }
  & .MuiFilledInput-root:after {
    border-color: #572a2a;
  }
`;
export default function CustomSelect({ label, list, value, onChange, className }) {
  return (
    <Grid item>
      <PrimaryAutocomplete
        disablePortal
        id="combo-box-demo"
        options={list}
        className={className}
        renderInput={(params) => <TextField {...params} label={label} />}
        onSelect={onChange}
      />
    </Grid>
  );
}
