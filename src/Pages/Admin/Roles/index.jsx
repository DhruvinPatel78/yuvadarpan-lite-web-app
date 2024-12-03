import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Tooltip } from "@mui/material";
import axios from "../../../util/useAxios";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";

export default function Index() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [roleData, setRoleData] = useState(null);

  const getList = async () => {
    dispatch(startLoading());
    await axios.get(`/role/get-all-list`).then((res) => {
      setRoleData(res);
    });
    dispatch(endLoading());
  };

  useEffect(() => {
    getList(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex w-full gap-2"}>
          <p className={"text-sm text-left"}>
            {record.value.replace("_", " ")}
          </p>
        </div>
      ),
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
          <CustomSwitch
            checked={record?.row?.active}
            onClick={(e) =>
              userActionHandler(record?.row, !record?.row?.active, "active")
            }
          />
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
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => deleteAPI(record?.row?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const userActionHandler = (roleInfo, action, field) => {
    axios
      .patch(`/role/update/${roleInfo?.id}`, {
        ...roleInfo,
        [field]: action,
      })
      .then(() => {
        getList();
      });
  };

  const deleteAPI = async (id) => {
    axios
      .delete(`/role/delete`, {
        data: {
          role: [id],
        },
      })
      .then(() => {
        getList();
      });
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className={"flex-col justify-center flex items-start"}>
        <div className={"flex w-full items-center justify-between my-2"}>
          <p className={"text-3xl font-bold cursor-default"}>Roles</p>
        </div>
        <CustomTable
          columns={roleListColumn}
          data={roleData}
          name={"role"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"nativeList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
          pagination={false}
        />
      </ContainerPage>
    </Box>
  );
}
