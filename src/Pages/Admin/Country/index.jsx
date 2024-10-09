import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Button, Tooltip } from "@mui/material";
import axios from "../../../util/useAxios";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Index() {
  const navigate = useNavigate();
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    handleCountryList();
  }, []);

  const handleCountryList = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/country/list`).then((res) => {
      setCountryList(res.data);
    });
  };

  const userActionHandler = (countryInfo, action, field) => {
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/country/update/${countryInfo?.id}`,
        {
          ...countryInfo,
          [field]: action,
        }
      )
      .then((res) =>
        setCountryList(res?.data?.map((data) => ({ ...data, id: data?._id })))
      );
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
          <Tooltip title={"View"}>
            <VisibilityIcon className={"text-primary cursor-pointer"} />
          </Tooltip>
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
          data={countryList}
          name={"users"}
          pageSize={10}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </div>
    </Box>
  );
}
