import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Button, Modal, Paper, Tooltip } from "@mui/material";
import axios from "../../../util/useAxios";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ContainerPage from "../../../Component/Container";

export default function Index() {
  const navigate = useNavigate();
  const [countryModalData, setCountryModalData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const userActionHandler = (countryInfo, action, field) => {
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/country/update/${countryInfo?.id}`,
        {
          ...countryInfo,
          [field]: action,
        }
      )
      .then(() => {
        getCountryList();
      });
  };
  const getCountryList = async () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/country/list?page=${
          page + 1
        }&limit=${rowsPerPage}`
      )
      .then((res) => {
        setCountryData(res.data);
      });
  };

  useEffect(() => {
    getCountryList();
  }, [page, rowsPerPage]);

  const deleteAPI = async (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/country/delete`, {
        data: {
          countries: [id],
        },
      })
      .then(() => {
        getCountryList();
      });
  };

  const countryListColumn = [
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
          {/*<Tooltip title={"View"}>*/}
          {/*  <VisibilityIcon className={"text-primary cursor-pointer"} />*/}
          {/*</Tooltip>*/}
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setCountryModalData(record?.row)}
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => deleteAPI(record.row?.id)}
            />
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
          <p className={"text-3xl font-bold"}>Country</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => navigate("/admin/country")}
          >
            Add Country
          </Button>
        </div>
        <CustomTable
          columns={countryListColumn}
          data={countryData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"userList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
        />
      </ContainerPage>
      {countryModalData ? (
        <Modal
          open={Boolean(countryModalData)}
          onClose={() => setCountryModalData(null)}
          sx={{
            "& .MuiModal-backdrop": {
              backdropFilter: "blur(2px) !important",
              background: "#878b9499 !important",
            },
          }}
          className="flex justify-center items-center"
        >
          <Paper
            elevation={10}
            className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none"
          >
            <div className={"flex flex-row justify-between"}>
              <span className={"text-2xl font-bold"}>Country</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => setCountryModalData(null)}
                />
              </Tooltip>
            </div>
          </Paper>
        </Modal>
      ) : null}
    </Box>
  );
}
