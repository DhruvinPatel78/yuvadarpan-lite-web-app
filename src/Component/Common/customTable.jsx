import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function CustomTable({ columns, data = [], pageSize, type }) {
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    if (pageSize) {
      setPagination({
        page: 0,
        pageSize: pageSize,
      });
    }
  }, [pageSize]);

  return (
    <DataGrid
      className="bg-white m-4"
      rows={data}
      columns={columns}
      paginationModel={pagination}
      pageSizeOptions={[5, 10, 25, 50, 100]}
      onPaginationModelChange={setPagination}
      disableColumnFilter
      disableColumnMenu
      disableRowSelectionOnClick
      pagination={true}
      checkboxSelection={type === "pendingList"}
      sx={{
        "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root, & .MuiDataGrid-sortIcon, & .MuiDataGrid-columnHeaderTitleContainerContent .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root":
          {
            color: "white",
          },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#572a2a",
        },
      }}
    />
  );
}

export default CustomTable;
