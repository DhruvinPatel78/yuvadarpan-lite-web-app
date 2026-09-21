import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TablePagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "./ConfirmModal";
import DeleteConfirmFlow from "./DeleteConfirmFlow";
import { masterNameText } from "../../util/bhasha";

const ACTION_COL_WIDTH = 156;

function gridNameText(params) {
  return masterNameText(params?.row) || "";
}

function normalizeTableColumns(columns = []) {
  return columns.map((col) => {
    const cellClassName = String(col.cellClassName || "")
      .replace(/\bpx-\d+\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (col.field === "action") {
      const rest = { ...col };
      delete rest.flex;
      return {
        ...rest,
        width: ACTION_COL_WIDTH,
        minWidth: ACTION_COL_WIDTH,
        maxWidth: ACTION_COL_WIDTH,
        sortable: false,
        cellClassName: `${cellClassName} !px-1`.trim(),
      };
    }

    if (col.field === "name" && !col.valueGetter && !col.renderCell) {
      return {
        ...col,
        minWidth: col.minWidth || col.width || 120,
        cellClassName: `${cellClassName} px-2`.trim(),
        valueGetter: gridNameText,
      };
    }

    return {
      ...col,
      minWidth: col.minWidth || col.width || 120,
      cellClassName: `${cellClassName} px-2`.trim(),
    };
  });
}

function CustomTable({
  columns,
  data = [],
  pageSize = 10,
  type,
  onRowSelectionModelChange,
  page = 0,
  className = "",
  setPage,
  setPageSize,
  pagination = true,
  checkboxSelection,
  onDeleteSelected,
  bulkActions = [],
  deleteEntity,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const showCheckboxes =
    checkboxSelection ??
    Boolean(onDeleteSelected || bulkActions.length || type === "pendingList");
  const showToolbar =
    selectedIds.length > 0 && (onDeleteSelected || bulkActions.length > 0);
  const normalizedColumns = useMemo(
    () => normalizeTableColumns(columns),
    [columns]
  );
  const tableMinWidth = useMemo(() => {
    const columnsWidth = normalizedColumns.reduce(
      (sum, col) => sum + (Number(col.minWidth) || 120),
      0
    );
    return columnsWidth + (showCheckboxes ? 58 : 0);
  }, [normalizedColumns, showCheckboxes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const handleSelectionChange = (ids) => {
    setSelectedIds(ids);
    onRowSelectionModelChange?.(ids);
  };

  const handleBulkDelete = async () => {
    await onDeleteSelected?.(selectedIds);
    setSelectedIds([]);
    onRowSelectionModelChange?.([]);
    setBulkDeleteOpen(false);
  };

  useEffect(() => {
    setSelectedIds([]);
    onRowSelectionModelChange?.([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <div className={"w-full min-w-0 bg-white rounded-xl border border-line overflow-hidden shadow-card"}>
      {showToolbar ? (
        <div
          className={"flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-line"}
        >
          <span className={"text-primary font-semibold"}>
            {selectedIds.length} Selected
          </span>
          <div className={"flex flex-wrap items-center gap-2"}>
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                size="small"
                variant={action.variant || "contained"}
                startIcon={action.icon || null}
                className={
                  action.variant === "outlined"
                    ? "!border-primary !text-primary"
                    : "!bg-primary !text-white"
                }
                onClick={() => action.onClick(selectedIds)}
              >
                {action.label}
              </Button>
            ))}
            {onDeleteSelected ? (
              <Button
                size="small"
                variant="contained"
                startIcon={<DeleteIcon />}
                className={"!bg-primary !text-white"}
                onClick={() => setBulkDeleteOpen(true)}
              >
                Delete Selected
              </Button>
            ) : null}
            <Button
              size="small"
              variant="outlined"
              className={"!border-primary !text-primary"}
              onClick={() => handleSelectionChange([])}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}
      <div className="w-full min-w-0 overflow-x-auto">
      <DataGrid
        className={`${className} bg-white border-0 ${showToolbar ? "!rounded-t-none" : ""}`}
        rows={data?.data || []}
        columns={normalizedColumns}
        autoHeight
        hideFooter
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        filterMode="server"
        sortingMode="client"
        checkboxSelection={showCheckboxes}
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={handleSelectionChange}
        getRowId={(row) => row.id}
        rowHeight={52}
        columnHeaderHeight={56}
        sx={{
          fontFamily: "WorkRegular, 'Work Sans', sans-serif",
          border: 0,
          width: "100%",
          minWidth: tableMinWidth,
          "& .MuiDataGrid-main": {
            width: "100%",
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
          },
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeadersInner, & .MuiDataGrid-columnHeaderRow":
            {
              backgroundColor: "#542b2b",
            },
          "& .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller, & .MuiDataGrid-scrollbarFiller--header":
            {
              backgroundColor: "#542b2b",
              border: "none",
            },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontFamily: "WorkSemiBold, 'Work Sans', sans-serif",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton .MuiSvgIcon-root":
            {
              color: "white !important",
            },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#542b2b",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeader.align-left .MuiDataGrid-columnHeaderTitleContainer":
            {
              justifyContent: "flex-start",
            },
          "& .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#e4ddd4",
            overflow: "hidden",
            minWidth: 0,
          },
          "& .MuiDataGrid-cell.align-left": {
            justifyContent: "flex-start",
            textAlign: "left",
          },
          "& .MuiDataGrid-cell[data-field='action']": {
            overflow: "visible",
          },
          "& .MuiDataGrid-cell[data-field='action'] .MuiButton-root": {
            minWidth: "32px !important",
            padding: "4px !important",
          },
          "& .MuiDataGrid-cellContent": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            width: "100%",
          },
          "& .MuiDataGrid-columnHeaderCheckbox": {
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              justifyContent: "center",
            },
            "& .MuiCheckbox-root, & .MuiCheckbox-root.Mui-checked, & .MuiCheckbox-root.MuiCheckbox-indeterminate":
              {
                color: "#ffffff !important",
              },
            "& .MuiCheckbox-root": {
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: "6px",
              padding: "4px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.3)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 22,
                color: "#ffffff !important",
              },
            },
          },
          "& .MuiDataGrid-cellCheckbox .MuiCheckbox-root": {
            color: "#542b2b !important",
            "&.Mui-checked, &.MuiCheckbox-indeterminate": {
              color: "#542b2b !important",
            },
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f7f3ef",
          },
          "& .MuiDataGrid-overlay": {
            backdropFilter: "blur(4px)",
          },
          "& .MuiCircularProgress-circle": {
            stroke: "#542b2b",
          },
        }}
      />
      </div>
      {pagination ? (
        <div className={"w-full bg-white p-2 flex justify-end border-t border-line overflow-x-auto"}>
          <TablePagination
            component="div"
            count={data ? Math.ceil(data?.total) : 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : null}
      {onDeleteSelected ? (
        deleteEntity ? (
          <DeleteConfirmFlow
            open={bulkDeleteOpen}
            entity={deleteEntity}
            ids={selectedIds}
            name={`${selectedIds.length} selected item${
              selectedIds.length === 1 ? "" : "s"
            }`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={handleBulkDelete}
          />
        ) : (
          <ConfirmModal
            open={bulkDeleteOpen}
            title="Are you sure?"
            description={`Are you sure you want to delete ${selectedIds.length} selected item${
              selectedIds.length === 1 ? "" : "s"
            }? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={handleBulkDelete}
          />
        )
      ) : null}
    </div>
  );
}

export default CustomTable;
