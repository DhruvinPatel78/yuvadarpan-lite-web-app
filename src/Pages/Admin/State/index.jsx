import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Tooltip } from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../util/useAxios";
import ContainerPage from "../../../Component/Container";

export default function Index() {
  const [stateData, setStateData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getStateList = async () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/state/list?page=${
          page + 1
        }&limit=${rowsPerPage}`
      )
      .then((res) => {
        setStateData(res.data);
      });
  };

  useEffect(() => {
    getStateList();
  }, [page, rowsPerPage]);

  const stateListColumn = [
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
      renderCell: (record) => (
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
      <ContainerPage className={"flex-col justify-center flex items-start"}>
        <div className={"flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>State</p>
        </div>
        <CustomTable
          columns={stateListColumn}
          data={stateData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </ContainerPage>
    </Box>
  );
}
