import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TablePagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { UseRedux } from "../useRedux";
import ConfirmModal from "./ConfirmModal";

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
}) {
  const { loading } = UseRedux();
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const showCheckboxes =
    checkboxSelection ??
    Boolean(onDeleteSelected || bulkActions.length || type === "pendingList");
  const showToolbar =
    selectedIds.length > 0 && (onDeleteSelected || bulkActions.length > 0);

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
    dispatch(startLoading());
    setTimeout(() => {
      dispatch(endLoading());
    }, 2000);
  }, [data?.data, page, pageSize]);

  useEffect(() => {
    setSelectedIds([]);
    onRowSelectionModelChange?.([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <div className={"w-full"}>
      {showToolbar ? (
        <div
          className={
            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 bg-[#fff5f4] border border-[#572a2a] border-b-0 rounded-t-lg"
          }
        >
          <span className={"text-[#572a2a] font-semibold"}>
            {selectedIds.length} selected
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
                    ? "!border-[#572a2a] !text-[#572a2a]"
                    : "!bg-[#572a2a] !text-white"
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
                className={"!bg-[#572a2a] !text-white"}
                onClick={() => setBulkDeleteOpen(true)}
              >
                Delete Selected
              </Button>
            ) : null}
            <Button
              size="small"
              variant="outlined"
              className={"!border-[#572a2a] !text-[#572a2a]"}
              onClick={() => handleSelectionChange([])}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}
      <DataGrid
        className={`${className} bg-white ${showToolbar ? "!rounded-t-none" : ""}`}
        rows={data?.data || []}
        columns={columns}
        hideFooter
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        checkboxSelection={showCheckboxes}
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={handleSelectionChange}
        loading={loading}
        getRowId={(row) => row.id}
        sx={{
          "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton .MuiSvgIcon-root":
            {
              color: "white !important",
            },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#572a2a",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer, & .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox": {
            minWidth: "58px !important",
            maxWidth: "58px !important",
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
            color: "#572a2a !important",
            "&.Mui-checked, &.MuiCheckbox-indeterminate": {
              color: "#572a2a !important",
            },
          },
          "& .MuiDataGrid-overlay": {
            backdropFilter: "blur(4px)",
          },
          "& .MuiCircularProgress-circle": {
            stroke: "#572a2a",
          },
        }}
      />
      {pagination ? (
        <div className={"w-full bg-white p-2 flex justify-end"}>
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
        <ConfirmModal
          open={bulkDeleteOpen}
          title="Delete confirmation"
          description={`Are you sure you want to delete ${selectedIds.length} selected item${
            selectedIds.length === 1 ? "" : "s"
          }? This action cannot be undone.`}
          onClose={() => setBulkDeleteOpen(false)}
          onConfirm={handleBulkDelete}
        />
      ) : null}
    </div>
  );
}

export default CustomTable;
