import React, { useState } from "react";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AppModal from "../UI/AppModal";
import Button from "../UI/Button";

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
    <AppModal open={open} onClose={handleClose}>
      <div className="p-5">
        <div className="flex flex-col items-center text-center gap-3">
          <WarningAmberRoundedIcon className="text-primary" sx={{ fontSize: 36 }} />
          <span className="text-xl font-semibold text-primary">{title}</span>
          <p className="text-sm text-mutedText">{description}</p>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleClose}
            disabled={busy}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleConfirm}
            disabled={busy}
            loading={busy}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </AppModal>
  );
}
