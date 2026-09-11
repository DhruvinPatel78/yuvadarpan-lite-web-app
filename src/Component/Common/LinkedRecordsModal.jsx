import React from "react";
import { CircularProgress } from "@mui/material";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import AppModal from "../UI/AppModal";
import { Button } from "../UI";

export default function LinkedRecordsModal({
  open,
  title = "Mapped / Linked Data",
  name,
  groups = [],
  loading = false,
  onClose,
  onOkay,
}) {
  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      maxWidth="560px"
      className="p-5 max-h-[85vh] flex flex-col"
    >
      <div className="flex flex-col items-center text-center gap-2 shrink-0">
        <LinkRoundedIcon className="text-primary" sx={{ fontSize: 32 }} />
        <span className="text-lg font-semibold text-primary">{title}</span>
        <p className="text-sm text-mutedText">
          {loading
            ? "Checking mapped / linked data..."
            : name
              ? `"${name}" is mapped / linked with the following data.`
              : "This item is mapped / linked with the following data."}
        </p>
      </div>
      <div className="mt-4 overflow-auto flex-1 pr-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <CircularProgress sx={{ color: "#542b2b" }} />
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.key}
              className="mb-3 border border-line rounded-lg overflow-hidden"
            >
              <div className="bg-muted text-primary px-3 py-2 text-sm font-semibold flex justify-between gap-2">
                <span>{group.label}</span>
                <span>{group.total}</span>
              </div>
              <ul className="max-h-40 overflow-auto divide-y divide-line bg-white">
                {(group.items || []).map((item) => (
                  <li key={item.id} className="px-3 py-2 text-left">
                    <p className="text-sm font-medium text-primary">
                      {item.name}
                    </p>
                    {item.detail ? (
                      <p className="text-xs text-mutedText">{item.detail}</p>
                    ) : null}
                  </li>
                ))}
                {group.total > (group.items || []).length ? (
                  <li className="px-3 py-2 text-sm text-mutedText">
                    and {group.total - group.items.length} more
                  </li>
                ) : null}
              </ul>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-4 shrink-0">
        {loading ? null : (
          <Button type="button" fullWidth onClick={onOkay}>
            Okay
          </Button>
        )}
      </div>
    </AppModal>
  );
}
