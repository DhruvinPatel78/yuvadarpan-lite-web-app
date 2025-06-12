import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TablePagination } from "@mui/material";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { UseRedux } from "../useRedux";

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
}) {
  const { loading } = UseRedux();
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };
  useEffect(() => {
    dispatch(startLoading());
    setTimeout(() => {
      dispatch(endLoading());
    }, 2000);
  }, [data?.data, page, pageSize]);
  return (
    <div className={"w-full"}>
      <DataGrid
        className={`${className} bg-white`}
        rows={data?.data || []}
        columns={columns}
        hideFooter
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        checkboxSelection={type === "pendingList"}
        onRowSelectionModelChange={onRowSelectionModelChange}
        loading={loading}
        sx={{
          "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root, & .MuiDataGrid-sortIcon, & .MuiDataGrid-columnHeaderTitleContainerContent .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root":
            {
              color: "white !important",
            },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#572a2a",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer, .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .Mui-checked": {
            color: "#572a2a !important",
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
    </div>
  );
}

export default CustomTable;
