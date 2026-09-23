import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Grid, styled, Select, Typography } from "@mui/material";
import { fieldControlCss } from "../UI/fieldStyles";
import { masterNameText } from "../../util/bhasha";
import { useFormLanguage } from "../../context/FormLanguageContext";

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
  const { language } = useFormLanguage();

  return (
    <Grid item {...rest}>
      <FormControl className={"w-full"} sx={{ position: "relative" }}>
        <InputLabel
          className={"text-primary"}
          color="primary"
          id={`select-helper-${name}`}
          {...(value != null && value !== "" ? { shrink: true } : {})}
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
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              sx: {
                maxHeight: 280,
                zIndex: 1500,
              },
            },
            sx: {
              zIndex: 1500,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errors ? "red !important" : "#d2c8c2 !important",
            }
          }}
        >
          <MenuItem value="">
            <em>{placeholder || "Select"}</em>
          </MenuItem>
          {(Array.isArray(list) ? list : []).map((data) => {
            const isObject = data && typeof data === "object";
            const optionValue = isObject
              ? String(data.value ?? data.id ?? "")
              : data;
            const optionLabel = isObject
              ? masterNameText(data, language) || data.label || optionValue
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
