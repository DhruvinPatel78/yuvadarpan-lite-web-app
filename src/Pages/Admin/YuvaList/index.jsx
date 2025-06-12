import Header from "../../../Component/Header";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Tab,
  Tooltip,
} from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/useAxios";
import {
  getSelectedData,
  ImageBackdrop,
  ImageButton,
  ImageSrc,
  listHandler,
  useFilteredIds,
  yuvaFilterList,
} from "../../../Component/constant";
import ContainerPage from "../../../Component/Container";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import { UseRedux } from "../../../Component/useRedux";

const YuvaList = () => {
  const navigate = useNavigate();
  const [yuvaList, setYuvaList] = useState(null);
  const [userData, setUserData] = useState(null);
  const [value, setValue] = React.useState("1");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { surname, city, state, region } = UseRedux();
  const [nativeList, setNativeList] = useState([]);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedNative, setSelectedNative] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    name: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    getNativeList();
    handleRequestList();
  }, [page, rowsPerPage]);

  const deleteAPI = async (id) => {
    try {
      await axios.delete(`/yuvaList/${id}`).then(() => {
        handleRequestList();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getNativeList = async () => {
    try {
      await axios
        .get(`/native/get-all-list`)
        .then((res) => {
          setNativeList(
            res.data.map((data) => ({
              ...data,
              label: data.name,
              value: data.id,
            }))
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const yuvaListColumn = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 90,
      headerClassName:
        "bg-[#572a2a] text-white items-center flex justify-center outline-none",
      cellClassName: "items-center flex justify-center outline-none",
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"w-full text-wrap px-2"}>
          <p className={"text-sm"}>
            {record.row.firstName} {record.row.middleName}{" "}
            {surname?.find((item) => item?.id === record?.row?.lastName)?.name}{" "}
          </p>
        </div>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-6 outline-none",
      filterable: false,
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 150,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      headerAlign: "center",
      cellClassName: "items-center flex p-0 justify-center outline-none",
      filterable: false,
      renderCell: (record) => (
        <p className={"w-full text-sm px-2"}>
          {moment(record.row.dob).format("DD/MM/YYYY hh:mm A")}
        </p>
      ),
    },
    {
      field: "firm",
      headerName: "Firm",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{city?.find((item) => item?.id === record?.row?.city)?.name}</>
      ),
    },
    {
      field: "native",
      headerName: "Native",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{nativeList.find((item) => item?.id === record?.row?.native)?.name}</>
      ),
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"View"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setUserData(record.row)}
            />
          </Tooltip>
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() =>
                navigate(`/admin/yuvalist/${record?.row.id}/edit`, {
                  state: { data: record?.row },
                })
              }
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => deleteAPI(record?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredNativeIds = useFilteredIds(selectedNative, "id");

  const handleRequestList = async (isRest = false) => {
    try {
      const text = selectedSearchByText
        ? {
            [selectedSearchBy.id]: isRest ? "" : selectedSearchByText,
          }
        : {};
      await axios
        .get(`/yuvaList/list?page=${page + 1}&limit=${rowsPerPage}`, {
          params: {
            lastName: isRest ? [] : filteredSurnameIds,
            native: isRest ? [] : filteredNativeIds,
            ...text,
          },
        })
        .then((res) => {
          setYuvaList(res?.data);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedSearchBy({
      label: "",
      id: "",
    });
    setSelectedSurname([]);
    setSelectedNative([]);
    handleRequestList(true);
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-4"}
      >
        <div
          className={
            "justify-between flex sm:items-center items-left w-full sm:flex-row flex-col gap-2"
          }
        >
          <p className={"text-3xl font-bold"}>Yuvalist</p>
          <div className={"flex flex-row gap-3"}>
            <Button
              className={"text-primary flex items-center justify-center"}
              onClick={() => navigate("/admin/userDashboard")}
            >
              View User Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              className={"bg-primary flex items-center justify-center"}
              onClick={() => navigate("/admin/yuvalist/add")}
            >
              Yuva
            </Button>
          </div>
        </div>
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomAutoComplete
              list={listHandler(surname)}
              multiple={true}
              label={"Surname"}
              placeholder={"Select Your Surname"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSurname}
              name="surname"
              onChange={(e, lastName) => {
                if (lastName) {
                  setSelectedSurname((pre) =>
                    getSelectedData(pre, lastName, e)
                  );
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(region)}
              multiple={true}
              label={"Native"}
              placeholder={"Select Your Native"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="native"
              value={selectedNative}
              onChange={(e, native) => {
                if (native) {
                  setSelectedNative((pre) => getSelectedData(pre, native, e));
                }
              }}
            />
            <CustomAutoComplete
              list={yuvaFilterList}
              label={"Search By"}
              placeholder={"Select Your Search By"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="search"
              value={selectedSearchBy.name}
              onChange={(e, search) => {
                setSelectedSearchBy({
                  name: search.label,
                  id: search.value,
                });
              }}
            />
            <CustomInput
              type={"text"}
              placeholder={"Enter Search Text"}
              name={"firstName"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => {
                setSelectedSearchByText(e.target.value);
                if (e.target.value === "") {
                  handleRequestList(true);
                }
              }}
              disabled={!selectedSearchBy.id}
            />

            <Grid
              item
              xs={12}
              className={"flex justify-center items-center gap-4"}
            >
              <button
                className={"bg-primary text-white p-2 px-4 rounded font-bold"}
                onClick={() => handleRequestList()}
              >
                Submit
              </button>
              {(selectedSearchByText ||
                selectedSearchBy.name ||
                selectedNative?.length > 0 ||
                selectedSurname?.length > 0) && (
                <button
                  className={
                    "bg-primary text-white p-2 px-4 rounded font-bold cursor-pointer"
                  }
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </Grid>
          </Grid>
        </CustomAccordion>
        <CustomTable
          columns={yuvaListColumn}
          className={"mx-0 w-full"}
          data={yuvaList}
          name={"YuvaList"}
          pageSize={rowsPerPage}
          type={"pendingList"}
          setPage={setPage}
          pages={page}
          setPageSize={setRowsPerPage}
        />
      </ContainerPage>
      <Modal
        open={Boolean(userData)}
        onClose={() => setUserData(null)}
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
        <Paper
          elevation={10}
          className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none"
        >
          <Grid container>
            <Grid item xs={3} className={"flex justify-center items-center"}>
              <ImageButton
                focusRipple
                style={{
                  width: "110px",
                  borderRadius: "150px",
                  border: "1px dashed #542b2b",
                }}
                onClick={() =>
                  window.open(
                    userData?.profile?.url ||
                      "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                    "_blank"
                  )
                }
              >
                <ImageSrc
                  style={{
                    backgroundImage:
                      `url(${userData?.profile?.url})` ||
                      `url(https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg)`,
                  }}
                  className={"m-2"}
                />
                <ImageBackdrop className="MuiImageBackdrop-root" />
              </ImageButton>
            </Grid>
            <Grid item xs={8} className={"px-2 flex flex-col justify-center"}>
              <div className={"text-base font-bold"}>
                Name:{" "}
                <span className={"font-normal"}>
                  {userData?.firstName}{" "}
                  {
                    surname.find((item) => item?.id === userData?.lastName)
                      ?.name
                  }{" "}
                </span>
              </div>
              <div className={"text-base font-bold"}>
                DOB:{" "}
                <span className={"font-normal"}>
                  {moment(userData?.dob).format("DD/MM/YYYY hh:mm A")}
                </span>
              </div>
              <div className={"text-base font-bold"}>
                Family ID:{" "}
                <span className={"font-normal"}>{userData?.familyId}</span>
              </div>
              <div className={"flex mt-2 gap-3 w-full"}>
                <button
                  className={"bg-primary text-white p-2 rounded-md w-full"}
                  onClick={() =>
                    navigate("/admin/yuvalist/profile", {
                      state: { ...userData },
                    })
                  }
                >
                  View Details
                </button>
                <button
                  className={
                    "border-primary border text-primary p-2 rounded-md"
                  }
                  onClick={() =>
                    navigate(`/admin/yuvalist/${userData?.id}/edit`, {
                      state: { ...userData },
                    })
                  }
                >
                  <ModeEditIcon />
                </button>
              </div>
            </Grid>
            <Grid item xs={1} className={"flex justify-center"}>
              <CloseIcon
                className={"text-primary cursor-pointer"}
                onClick={() => setUserData(null)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box className={"my-4"}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      className={"text-primary"}
                      textColor="text-primary"
                      indicatorColor="inherit"
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: "#542b2b",
                        },
                      }}
                      variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                    >
                      <Tab
                        label="Personal Info"
                        value="1"
                        className={`font-bold ${
                          value === "1" ? "text-primary" : "text-gray"
                        }`}
                      />
                      <Tab
                        label="Mama Info"
                        value="2"
                        className={`font-bold ${
                          value === "2" ? "text-primary" : "text-gray"
                        }`}
                      />
                      <Tab
                        label="Contact Info"
                        value="4"
                        className={`font-bold ${
                          value === "4" ? "text-primary" : "text-gray"
                        }`}
                      />
                      <Tab
                        label="Other Info"
                        value="3"
                        className={`font-bold ${
                          value === "3" ? "text-primary" : "text-gray"
                        }`}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Grid spacing={2} container>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Father Name:{" "}
                          <span className={"font-normal"}>
                            {userData?.fatherName}
                          </span>
                        </div>
                        <div className={"text-base font-bold"}>
                          Height:{" "}
                          <span className={"font-normal"}>
                            {userData?.height}
                          </span>
                        </div>
                        <div className={"text-base font-bold"}>
                          City:{" "}
                          <span className={"font-normal"}>
                            {
                              city.find((item) => item?.id === userData?.city)
                                ?.name
                            }
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Mother Name:{" "}
                          <span className={"font-normal"}>
                            {userData?.motherName}
                          </span>
                        </div>
                        <div className={"text-base font-bold"}>
                          Weight:{" "}
                          <span className={"font-normal"}>
                            {userData?.weight}
                          </span>
                        </div>
                        <div className={"text-base font-bold"}>
                          State:{" "}
                          <span className={"font-normal"}>
                            {
                              state?.find(
                                (item) => item?.id === userData?.state
                              )?.name
                            }
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Firm:{" "}
                          <span className={"font-normal"}>
                            {userData?.firm}
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold ellipsis"}>
                          Firm Address:{" "}
                          <span className={"font-normal"}>
                            {userData?.firmAddress}
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="2">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div className={"text-base font-bold"}>
                          Name:{" "}
                          <span className={"font-normal"}>
                            {userData?.mamaInfo?.name}
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid spacing={1} container>
                          <Grid item xs={12}>
                            <div className={"text-base font-bold"}>
                              Address:-
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className={"text-base font-bold"}>
                              Native:
                              <span className={"font-normal"}>
                                {userData?.mamaInfo?.native}
                              </span>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className={"text-base font-bold"}>
                              City:{" "}
                              <span className={"font-normal"}>
                                {userData?.mamaInfo?.city}
                              </span>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="3">
                    <Grid spacing={2} container>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Education:{" "}
                          <span className={"font-normal"}>
                            {userData?.education}
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Blood Group:{" "}
                          <span className={"font-normal"}>
                            {userData?.bloodGroup}
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="4">
                    <Grid spacing={2} container>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Name:{" "}
                          <span className={"font-normal"}>
                            {userData?.contactInfo?.name}
                          </span>
                        </div>
                        <div className={"text-base font-bold"}>
                          Relation:{" "}
                          <span className={"font-normal"}>
                            {userData?.contactInfo?.relation}
                          </span>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={"text-base font-bold"}>
                          Number:{" "}
                          <span className={"font-normal"}>
                            {userData?.contactInfo?.phone}
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Box>
  );
};

export default YuvaList;
