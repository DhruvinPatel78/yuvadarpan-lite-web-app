import React from "react";
import { Modal, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AppModal({
  open,
  onClose,
  children,
  className = "",
  maxWidth = "480px",
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center p-4"
      sx={{
        "& .MuiModal-backdrop": {
          background: "rgba(84,43,43,0.32) !important",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Paper
        elevation={0}
        className="!rounded-xl outline-none w-full overflow-hidden"
        sx={{
          maxWidth,
          boxShadow: "0 16px 48px rgba(84,43,43,0.18)",
        }}
      >
        <div className={`relative ${className}`}>{children}</div>
      </Paper>
    </Modal>
  );
}

export function FormModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "600px",
  className = "",
}) {
  return (
    <AppModal
      open={Boolean(open)}
      onClose={onClose}
      maxWidth={maxWidth}
      className={`max-h-[92vh] overflow-y-auto p-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-primary leading-snug">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-primary p-1 rounded-md hover:bg-muted"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </AppModal>
  );
}
