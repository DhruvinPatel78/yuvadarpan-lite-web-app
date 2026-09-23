import React from "react";
import {
  Badge,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Card from "./Card";
import { useFormLanguage } from "../../context/FormLanguageContext";

export const searchFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    minHeight: 44,
    "& fieldset": { borderColor: "#d7d7e2" },
    "&:hover fieldset": { borderColor: "#c8c8d4" },
    "&.Mui-focused fieldset": { borderColor: "#542b2b" },
  },
};

export default function MasterFilterBar({
  leading,
  searchPlaceholder,
  searchValue = "",
  onSearchChange,
  searchDisabled = false,
  filterCount = 0,
  onFilterClick,
  extraFilters,
  isFilterOpen = false,
  className = "",
  hideFilterBadge = false,
  searchDisabledHint,
}) {
  const { t } = useFormLanguage();
  const hasExtra = Boolean(extraFilters);
  const disabledHint = searchDisabledHint || t("searchDisabledHint");
  const placeholder = searchDisabled
    ? disabledHint
    : searchPlaceholder || t("search");

  return (
    <Card padded={false} className={`p-2.5 sm:p-3 w-full ${className}`}>
      <div className="flex items-center gap-2 w-full min-w-0">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div
          className={`flex-1 min-w-0 ${searchDisabled ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (searchDisabled && !isFilterOpen) {
              onFilterClick?.();
            }
          }}
        >
          <TextField
            className="w-full"
            placeholder={placeholder}
            value={searchValue}
            onChange={onSearchChange}
            disabled={searchDisabled}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9a9aa8" }} />
                </InputAdornment>
              ),
            }}
            sx={searchFieldSx}
          />
        </div>
        {!hideFilterBadge ?
        <Badge badgeContent={filterCount} color="error" overlap="circular" className="shrink-0 self-center">
          <IconButton
            aria-label="Filter"
            aria-expanded={hasExtra ? isFilterOpen : undefined}
            onClick={onFilterClick}
            className="!h-11 !w-11 !rounded-lg shrink-0 !border !border-solid !border-line"
            sx={{
              color: "#542b2b",
              backgroundColor:
                isFilterOpen || filterCount > 0 ? "#ececf4" : "#f6f6fa",
              "&:hover": {
                backgroundColor: "#e8e8ef",
              },
            }}
          >
            <TuneIcon />
          </IconButton>
        </Badge>
        : null}
      </div>
      {hasExtra ? (
        <Collapse in={isFilterOpen} timeout={280}>
          <div className="border-t border-line mt-3 sm:mt-4 pt-4">
            {extraFilters}
          </div>
        </Collapse>
      ) : null}
    </Card>
  );
}
