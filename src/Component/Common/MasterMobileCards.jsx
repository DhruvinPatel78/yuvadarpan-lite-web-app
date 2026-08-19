import React from "react";
import {
  Button,
  Checkbox,
  Paper,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomSwitch from "./CustomSwitch";

const MasterMobileCards = ({
  rows = [],
  emptyText = "No records",
  selectedIds = [],
  onToggleSelect,
  canSelect = false,
  getTitle = (row) => row?.name || "-",
  getDetails,
  showActive = true,
  activeDisabled = false,
  onActiveChange,
  onView,
  onEdit,
  onDelete,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total = 0,
  showPagination = true,
  onDeleteSelected,
}) => {
  const hasFooterActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className={"md:hidden w-full flex flex-col gap-3"}>
      {canSelect && selectedIds.length > 0 ? (
        <div
          className={
            "w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-[#fff5f4] border border-[#572a2a] rounded-lg"
          }
        >
          <span className={"text-[#572a2a] font-semibold"}>
            {selectedIds.length} selected
          </span>
          {onDeleteSelected ? (
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              className={"!bg-[#572a2a] !text-white"}
              onClick={() => onDeleteSelected(selectedIds)}
            >
              Delete Selected
            </Button>
          ) : null}
        </div>
      ) : null}
      {rows.length ? (
        rows.map((row) => {
          const id = row.id;
          const isSelected = selectedIds.includes(id);
          const details = getDetails ? getDetails(row) : [];
          const actionCount = [onView, onEdit, onDelete].filter(Boolean).length;
          return (
            <Paper
              key={id}
              elevation={2}
              className={"rounded-xl overflow-hidden border border-[#ead9d9]"}
            >
              <div className={"p-3"}>
                <div className={"flex items-center justify-between gap-2"}>
                  <p
                    className={
                      "font-bold text-[#572a2a] text-base leading-tight min-w-0 pr-1"
                    }
                  >
                    {getTitle(row)}
                  </p>
                  {canSelect ? (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect(id)}
                      className={"!text-[#572a2a] !p-0 !m-0 shrink-0"}
                    />
                  ) : null}
                </div>
                {details.map((line) =>
                  line ? (
                    <p key={line} className={"text-sm text-gray-600 mt-1"}>
                      {line}
                    </p>
                  ) : null
                )}
                {showActive ? (
                  <div className={"flex items-center gap-1 mt-2"}>
                    <span className={"text-sm text-gray-600"}>Active</span>
                    <CustomSwitch
                      checked={Boolean(row.active)}
                      disabled={activeDisabled}
                      onClick={() => {
                        if (activeDisabled || !onActiveChange) return;
                        onActiveChange(row, !row.active);
                      }}
                    />
                  </div>
                ) : null}
              </div>
              {hasFooterActions ? (
                <div className={"flex border-t border-[#ead9d9]"}>
                  {onView ? (
                    <button
                      type="button"
                      className={`flex-1 py-2.5 text-sm font-semibold text-[#572a2a] ${
                        actionCount > 1 ? "border-r border-[#ead9d9]" : ""
                      }`}
                      onClick={() => onView(row)}
                    >
                      View
                    </button>
                  ) : null}
                  {onEdit ? (
                    <button
                      type="button"
                      className={`flex-1 py-2.5 text-sm font-semibold text-[#572a2a] ${
                        onDelete ? "border-r border-[#ead9d9]" : ""
                      }`}
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      className={"flex-1 py-2.5 text-sm font-semibold text-[#ff0000]"}
                      onClick={() => onDelete(row)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              ) : null}
            </Paper>
          );
        })
      ) : (
        <Paper className={"p-6 text-center text-gray-500 rounded-xl"}>
          {emptyText}
        </Paper>
      )}
      {showPagination && rows.length ? (
        <div className={"w-full bg-white rounded-xl flex justify-end"}>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default MasterMobileCards;
