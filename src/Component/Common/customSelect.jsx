import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Grid, styled, Select, Typography, TextField } from "@mui/material";
import { Autocomplete } from "@mui/lab";
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
`;
export default function CustomSelect({ label, list, value, onChange }) {
  return (
    <Grid item>
      <PrimaryAutocomplete
        disablePortal
        id="combo-box-demo"
        options={list}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={label} />}
        onSelect={onChange}
      />
    </Grid>
  );
}
