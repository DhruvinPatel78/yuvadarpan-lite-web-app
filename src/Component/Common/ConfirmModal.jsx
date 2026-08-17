import React, { useState } from "react";
import { CircularProgress, Modal, Paper } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export const getDeleteDescription = (name) =>
  name
    ? `Are you sure you want to delete "${name}"? This action cannot be undone.`
    : "Are you sure you want to delete this? This action cannot be undone.";

export default function ConfirmModal({
  open,
  title = "Delete confirmation",
  description = "Are you sure you want to delete this? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onClose,
  onConfirm,
}) {
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    if (busy) return;
    onClose?.();
  };

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await onConfirm?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiModal-backdrop": {
          backdropFilter: "blur(2px) !important",
          background: "#878b9499 !important",
        },
      }}
      className="flex justify-center items-center"
    >
      <Paper
        elevation={10}
        className="!rounded-2xl p-5 w-3/4 max-w-[480px] outline-none"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <WarningAmberRoundedIcon className="text-primary" sx={{ fontSize: 48 }} />
          <span className="text-2xl font-bold">{title}</span>
          <p className="text-base text-gray-700">{description}</p>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            className="w-full p-3 rounded-lg font-bold border border-[#572a2a] text-[#572a2a]"
            onClick={handleClose}
            disabled={busy}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="w-full p-3 rounded-lg font-bold bg-[#572a2a] text-white disabled:opacity-50 flex justify-center items-center"
            onClick={handleConfirm}
            disabled={busy}
          >
            {busy ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </Paper>
    </Modal>
  );
}
