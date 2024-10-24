import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Tooltip } from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTable from "../../../Component/Common/customTable";
import axios from "../../../util/useAxios";

export default function Index() {
  const [regionData, setRegionData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getRegionList = async () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/region/list?page=${
          page + 1
        }&limit=${rowsPerPage}`
      )
      .then((res) => {
        setRegionData(res.data);
      });
  };

  useEffect(() => {
    getRegionList();
  }, [page, rowsPerPage]);

  const regionListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <CustomSwitch checked={record?.row?.active} />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: () => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"Edit"}>
            <ModeEditIcon className={"text-primary cursor-pointer"} />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon className={"text-primary cursor-pointer"} />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto"
        }
      >
        <div className={"p-4 pb-0 flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>Region</p>
        </div>
        <CustomTable
          columns={regionListColumn}
          data={regionData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </div>
    </Box>
  );
}
