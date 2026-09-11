import React from "react";
import { CircularProgress, IconButton } from "@mui/material";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover border border-transparent",
  secondary:
    "bg-white text-primary border border-line hover:border-primary hover:bg-muted",
  ghost:
    "bg-transparent text-primary border border-transparent hover:bg-muted",
  danger: "bg-error text-white hover:bg-[#b91c1c] border border-transparent",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = false,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 h-11 md:h-10 px-4 rounded-lg text-sm font-WorkSemiBold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
        fullWidth ? "w-full" : ""
      } ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {loading ? <CircularProgress size={16} color="inherit" /> : icon}
      {loading ? null : children}
    </button>
  );
}

export function IconBtn({ className = "", children, ...rest }) {
  return (
    <IconButton
      className={`!w-11 !h-11 md:!w-9 md:!h-9 !rounded-lg !bg-muted !text-primary hover:!bg-line !border !border-solid !border-line ${className}`}
      {...rest}
    >
      {children}
    </IconButton>
  );
}

export function FilterActions({
  onSubmit,
  onReset,
  showReset = false,
  submitLabel = "Submit",
  resetLabel = "Reset",
}) {
  return (
    <div className="flex flex-col-reverse md:flex-row md:flex-wrap items-stretch md:items-center gap-2 w-full md:w-auto">
      <Button type="button" onClick={onSubmit} className="max-md:w-full">
        {submitLabel}
      </Button>
      {showReset ? (
        <Button type="button" variant="secondary" onClick={onReset} className="max-md:w-full">
          {resetLabel}
        </Button>
      ) : null}
    </div>
  );
}
