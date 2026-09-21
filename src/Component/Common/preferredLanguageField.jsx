import React from "react";
import { Grid } from "@mui/material";

const OPTIONS = [
  { id: "en", label: "English" },
  { id: "gu", label: "ગુજરાતી" },
];

export default function PreferredLanguageField({
  value = "gu",
  onChange,
  name = "language",
  errors,
  label = "Preferred Language",
  xs = 12,
  sm,
  md,
}) {
  return (
    <Grid item xs={xs} sm={sm} md={md}>
      <p className="text-sm font-semibold text-primary mb-0.5">{label}</p>
      <div className="inline-flex w-full sm:w-auto rounded-full border border-[#d7d0c8] bg-white p-1">
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              name={name}
              onClick={() => onChange?.(option.id)}
              className={`flex-1 sm:flex-none min-w-[108px] h-8 px-4 rounded-full text-sm font-WorkSemiBold transition-colors ${
                selected
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary hover:bg-[#f6eee8]"
              }`}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {errors ? (
        <p className="text-error text-sm transition-all mt-1">{errors}</p>
      ) : null}
    </Grid>
  );
}
