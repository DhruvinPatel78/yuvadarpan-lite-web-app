import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TablePagination } from "@mui/material";

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
}) {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  return (
    <div className={"mx-4 w-full"}>
      <DataGrid
        className={`${className} bg-white`}
        rows={data?.data?.map((item) => ({ ...item, id: item?._id })) || []}
        columns={columns}
        hideFooter
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        checkboxSelection={type === "pendingList"}
        onRowSelectionModelChange={onRowSelectionModelChange}
        sx={{
          "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root, & .MuiDataGrid-sortIcon, & .MuiDataGrid-columnHeaderTitleContainerContent .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root":
            {
              color: "white !important",
            },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#572a2a",
          },
          "& .Mui-checked": {
            color: "#572a2a !important",
          },
        }}
      />
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
    </div>
  );
}

export default CustomTable;
