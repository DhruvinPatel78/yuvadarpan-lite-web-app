import React, { useState } from "react";
import { Checkbox, TablePagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomSwitch from "./CustomSwitch";
import DeleteConfirmFlow from "./DeleteConfirmFlow";
import { Button, Card } from "../UI";

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
  deleteEntity,
}) => {
  const hasFooterActions = Boolean(onView || onEdit || onDelete);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  return (
    <div className={"md:hidden w-full flex flex-col gap-3"}>
      {canSelect && selectedIds.length > 0 ? (
        <div
          className={
            "w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-3 py-2.5 bg-muted border border-line rounded-lg"
          }
        >
          <span className={"text-primary font-semibold"}>
            {selectedIds.length} selected
          </span>
          {onDeleteSelected ? (
            <Button
              icon={<DeleteIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                if (deleteEntity) {
                  setBulkDeleteOpen(true);
                } else {
                  onDeleteSelected(selectedIds);
                }
              }}
              className="max-sm:w-full"
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
            <Card
              key={id}
              padded={false}
              className={"overflow-hidden"}
            >
              <div className={"p-3.5"}>
                <div className={"flex items-start justify-between gap-2"}>
                  <p
                    className={
                      "font-semibold text-primary text-[15px] leading-tight min-w-0 pr-1 break-words"
                    }
                  >
                    {getTitle(row)}
                  </p>
                  {canSelect ? (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect(id)}
                      className={"!text-primary !p-2 !-m-2 shrink-0"}
                    />
                  ) : null}
                </div>
                {details.map((line) =>
                  line ? (
                    <p key={line} className={"text-sm text-gray-600 mt-1 break-words"}>
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
                <div className={"flex border-t border-[#ececf3]"}>
                  {onView ? (
                    <button
                      type="button"
                      className={`flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary ${
                        actionCount > 1 ? "border-r border-[#ececf3]" : ""
                      }`}
                      onClick={() => onView(row)}
                    >
                      View
                    </button>
                  ) : null}
                  {onEdit ? (
                    <button
                      type="button"
                      className={`flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary ${
                        onDelete ? "border-r border-[#ececf3]" : ""
                      }`}
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-[#ff0000]"}
                      onClick={() => onDelete(row)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              ) : null}
            </Card>
          );
        })
      ) : (
        <Card className={"text-center py-10 px-4"}>
          <p className="text-sm font-semibold text-primary">{emptyText}</p>
          <p className="text-sm text-mutedText mt-1">Nothing to show yet.</p>
        </Card>
      )}
      {showPagination && rows.length ? (
        <div className={"w-full bg-white rounded-xl overflow-x-auto"}>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
            labelRowsPerPage=""
            sx={{
              width: "100%",
              "& .MuiTablePagination-toolbar": {
                paddingLeft: 1,
                paddingRight: 1,
              },
            }}
          />
        </div>
      ) : null}
      {deleteEntity && onDeleteSelected ? (
        <DeleteConfirmFlow
          open={bulkDeleteOpen}
          entity={deleteEntity}
          ids={selectedIds}
          name={`${selectedIds.length} selected item${
            selectedIds.length === 1 ? "" : "s"
          }`}
          onClose={() => setBulkDeleteOpen(false)}
          onConfirm={async () => {
            await onDeleteSelected(selectedIds);
            setBulkDeleteOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default MasterMobileCards;
