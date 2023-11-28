import React from "react";
import Table from "../Common/Table";
import { Box, Button, Paper, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";

const usersTableHeader = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    flex: 2,
    headerClassName: "bg-[#572a2a] text-white",
    cellClassName: "items-center flex px-8",
    filterable: false,
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    flex: 2,
    headerClassName: "bg-[#572a2a] text-white",
    cellClassName: "items-center flex px-8",
    filterable: false,
  },
  {
    field: "middleName",
    headerName: "Middle name",
    width: 150,
    flex: 2,
    headerClassName: "bg-[#572a2a] text-white",
    cellClassName: "items-center flex px-8",
    filterable: false,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    flex: 2,
    headerClassName: "bg-[#572a2a] text-white",
    cellClassName: "items-center flex px-8",
    filterable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    flex: 2,
    headerClassName: "bg-[#572a2a] text-white",
    cellClassName: "items-center flex px-8",
    filterable: false,
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    flex: 2,
    headerClassName: "bg-[#572a2a] text-white place-content-center",
    cellClassName: "items-center flex px-8",
    filterable: false,
    renderCell: (record) => (
      <div className={"flex gap-2"}>
        <Tooltip title={"Accept"}>
          <Button
            variant="text"
            className={"!text-[#34c375]"}
            // onClick={() => handleOpenEditUser(record.row)}
          >
            <CheckIcon />
          </Button>
        </Tooltip>
        <Tooltip title={"Reject"}>
          <Button
            variant="text"
            className={"!text-[#ff0000]"}
            // onClick={() => handleOpenEditUser(record.row)}
          >
            <CloseIcon />
          </Button>
        </Tooltip>
      </div>
    ),
  },
];

const userList = [
  {
    id: 1,
    firstName: "Jon",
    middleName: "Wed",
    lastName: "Snow",
    email: "jon@123",
  },
  {
    id: 2,
    firstName: "Cersei",
    middleName: "Aed",
    lastName: "Lannister",
    email: "Cersei@123",
  },
  {
    id: 3,
    firstName: "Jaime",
    middleName: "Bed",
    lastName: "Lannister",
    email: "Jaime@123",
  },
  {
    id: 4,
    firstName: "Arya",
    middleName: "Fed",
    lastName: "Stark",
    email: "Arya@123",
  },
  {
    id: 5,
    firstName: "Daenerys",
    middleName: "Ged",
    lastName: "Targaryen",
    email: "Daenerys@123",
  },
  {
    id: 6,
    firstName: null,
    middleName: "Hed",
    lastName: "Melisandre",
    email: "Melisandre@123",
  },
  {
    id: 7,
    firstName: "Ferrara",
    middleName: "Jed",
    lastName: "Clifford",
    email: "Ferrara@123",
  },
  {
    id: 8,
    firstName: "Rossini",
    middleName: "Ked",
    lastName: "Frances",
    email: "Rossini@123",
  },
  {
    id: 9,
    firstName: "Harvey",
    middleName: "Led",
    lastName: "Roxie",
    email: "Harvey@123",
  },
  {
    id: 10,
    firstName: "Jon",
    middleName: "Wed",
    lastName: "Snow",
    email: "jon@123",
  },
  {
    id: 11,
    firstName: "Cersei",
    middleName: "Aed",
    lastName: "Lannister",
    email: "Cersei@123",
  },
  {
    id: 12,
    firstName: "Jaime",
    middleName: "Bed",
    lastName: "Lannister",
    email: "Jaime@123",
  },
  {
    id: 13,
    firstName: "Arya",
    middleName: "Fed",
    lastName: "Stark",
    email: "Arya@123",
  },
  {
    id: 14,
    firstName: "Daenerys",
    middleName: "Ged",
    lastName: "Targaryen",
    email: "Daenerys@123",
  },
  {
    id: 15,
    firstName: null,
    middleName: "Hed",
    lastName: "Melisandre",
    email: "Melisandre@123",
  },
  {
    id: 16,
    firstName: "Ferrara",
    middleName: "Jed",
    lastName: "Clifford",
    email: "Ferrara@123",
  },
  {
    id: 17,
    firstName: "Rossini",
    middleName: "Ked",
    lastName: "Frances",
    email: "Rossini@123",
  },
  {
    id: 18,
    firstName: "Harvey",
    middleName: "Led",
    lastName: "Roxie",
    email: "Harvey@123",
  },
];

function List() {
  const navigate = useNavigate();
  return (
    <Box className="p-4">
      <div className="pb-2 text-end ">
        <Tooltip title={"Back"}>
          <button
            className={
              "bg-[#572a2a] border text-white rounded p-2 hover:scale-105"
            }
            onClick={() => navigate("/dashboard")}
          >
            <ArrowBackOutlinedIcon />
          </button>
        </Tooltip>
      </div>
      <Table
        columns={usersTableHeader}
        data={userList}
        name={"users"}
        pageSize={10}
        type={"userList"}
      />
    </Box>
  );
}

export default List;
