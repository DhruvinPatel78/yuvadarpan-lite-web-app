import { createTheme } from "@mui/material/styles";

export const tokens = {
  primary: "#542b2b",
  primaryHover: "#462424",
  primarySoft: "#f4ebe6",
  primaryTint: "#efe4dc",
  secondary: "#717171",
  success: "#15803d",
  warning: "#b45309",
  error: "#dc2626",
  info: "#1d4ed8",
  background: "#f4f0ea",
  surface: "#ffffff",
  mutedSurface: "#f7f3ef",
  border: "#e4ddd4",
  inputBorder: "#d7d0c8",
  text: "#542b2b",
  mutedText: "#6b7280",
  disabledText: "#9ca3af",
  focus: "#542b2b",
  radius: 8,
  radiusCard: 12,
  shadow: "0 1px 2px rgba(84,43,43,0.06), 0 8px 20px rgba(84,43,43,0.06)",
};

const theme = createTheme({
  palette: {
    primary: { main: tokens.primary, dark: tokens.primaryHover },
    error: { main: tokens.error },
    warning: { main: tokens.warning },
    success: { main: tokens.success },
    info: { main: tokens.info },
    background: { default: tokens.background, paper: tokens.surface },
    text: { primary: tokens.text, secondary: tokens.secondary, disabled: tokens.disabledText },
    divider: tokens.border,
  },
  typography: {
    fontFamily: "WorkRegular, Work Sans, sans-serif",
    h1: { fontWeight: 700, fontSize: "1.75rem", lineHeight: 1.25 },
    h2: { fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.3 },
    body1: { fontSize: "0.95rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, color: tokens.mutedText },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: tokens.radius },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.background,
          color: tokens.text,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: tokens.radius, fontWeight: 600, minHeight: 40, boxShadow: "none" },
        containedPrimary: {
          backgroundColor: tokens.primary,
          "&:hover": { backgroundColor: tokens.primaryHover },
        },
        outlinedPrimary: {
          borderColor: tokens.primary,
          color: tokens.primary,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius,
          backgroundColor: tokens.surface,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.inputBorder,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#c8c8d4",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: tokens.radiusCard },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.border}`,
          borderRadius: `${tokens.radiusCard}px !important`,
          boxShadow: tokens.shadow,
          "&:before": { display: "none" },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.primary,
          fontSize: 12,
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: tokens.radius },
      },
    },
    MuiSnackbar: {
      defaultProps: { anchorOrigin: { vertical: "top", horizontal: "center" } },
    },
  },
});

export default theme;
