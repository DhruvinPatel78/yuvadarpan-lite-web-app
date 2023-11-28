import React from "react";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../Common/customTable";
import CustomCard from "../Common/customCard";
import useDashboard from "./useDashboard";

const pendingUsersTableHeader = [
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
const pendingUsersList = [
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
];

function Dashboard() {
  const {
    anchorEl,
    pendingListOpen,
    navigate,
    handleClose,
    pendingListModalOpen,
    pendingListModalClose,
  } = useDashboard();

  return (
    <Box>
      <AppBar position="static" className="!bg-[#572a2a]">
        <Toolbar>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} className="p-4">
        <CustomCard title={"New Request"} action={pendingListModalOpen} />
        <CustomCard title={"User List"} action={() => navigate("/userlist")} />
        <CustomCard title={"Yuva List"} action={() => navigate("/yuvalist")} />
      </Grid>
      <Modal
        open={pendingListOpen}
        onClose={pendingListModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          "& .MuiModal-backdrop": {
            backdropFilter: " blur(2px) !important",
            background: "#878b9499 !important",
          },
        }}
        className="flex justify-center items-center"
      >
        <Paper elevation={10} className="!rounded-2xl p-4 w-4/5">
          <div className="pb-2 text-end ">
            <Tooltip title={"Accept All"}>
              <button
                className={
                  "bg-[#572a2a] border text-white rounded p-2 hover:scale-105"
                }
              >
                <PlaylistAddCheckIcon />
              </button>
            </Tooltip>
            <Tooltip title={"Reject All"} className="ml-3">
              <button
                className={
                  "bg-white text-[#572a2a] border border-[#572a2a] rounded p-2 hover:scale-105"
                }
              >
                <PlaylistRemoveIcon />
              </button>
            </Tooltip>
          </div>
          <CustomTable
            columns={pendingUsersTableHeader}
            data={pendingUsersList}
            name={"pendingUser"}
            pageSize={10}
            type={"pendingList"}
          />
        </Paper>
      </Modal>
    </Box>
  );
}

export default Dashboard;
