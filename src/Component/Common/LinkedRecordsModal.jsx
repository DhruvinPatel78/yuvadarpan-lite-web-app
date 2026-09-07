import React from "react";
import { CircularProgress, Modal, Paper } from "@mui/material";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

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
        className="!rounded-2xl p-5 w-[90%] max-w-[560px] outline-none max-h-[85vh] flex flex-col"
      >
        <div className="flex flex-col items-center text-center gap-2 shrink-0">
          <LinkRoundedIcon className="text-primary" sx={{ fontSize: 44 }} />
          <span className="text-2xl font-bold">{title}</span>
          <p className="text-base text-gray-700">
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
              <CircularProgress sx={{ color: "#572a2a" }} />
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.key}
                className="mb-4 border border-[#ead9d9] rounded-xl overflow-hidden"
              >
                <div className="bg-[#572a2a] text-white px-3 py-2 font-semibold flex justify-between gap-2">
                  <span>{group.label}</span>
                  <span>{group.total}</span>
                </div>
                <ul className="max-h-40 overflow-auto divide-y divide-[#ead9d9] bg-white">
                  {(group.items || []).map((item) => (
                    <li key={item.id} className="px-3 py-2 text-left">
                      <p className="text-sm font-medium text-[#572a2a]">
                        {item.name}
                      </p>
                      {item.detail ? (
                        <p className="text-xs text-gray-500">{item.detail}</p>
                      ) : null}
                    </li>
                  ))}
                  {group.total > (group.items || []).length ? (
                    <li className="px-3 py-2 text-sm text-gray-500">
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
            <button
              type="button"
              className="w-full p-3 rounded-lg font-bold bg-[#572a2a] text-white"
              onClick={onOkay}
            >
              Okay
            </button>
          )}
        </div>
      </Paper>
    </Modal>
  );
}
