import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import CustomTable from "../../../Component/Common/customTable";
import Header from "../../../Component/Header";
import CustomTextFieldInfo from "../../../Component/Common/customTextFieldInfo";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../../util/useAxios";
import ContainerPage from "../../../Component/Container";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import { useSelector } from "react-redux";
import CustomInput from "../../../Component/Common/customInput";

export default function Index() {
  const { notification, setNotification } = NotificationData();
  const { auth, surname, region, state, samaj } = useSelector((state) => ({
    auth: state.auth,
    surname: state.location.surname,
    region: state.location.region,
    samaj: state.location.samaj,
    state: state.location.state,
  }));
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    label: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");

  useEffect(() => {
    handleRequestList(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setSelectedUser(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  const setLabelValueInList = (data) => {
    return data.map((data) => ({
      ...data,
      label: data.name,
      value: data.id,
    }));
  };
  const userActionHandler = (userInfo, action) => {
    axios
      .patch(`/user/update/${userInfo._id}`, {
        ...userInfo,
        allowed: action,
      })
      .then((res) => {
        handleRequestList();
        setNotification({ type: "success", message: "Success !" });
      })
      .catch((e) => {
        setNotification({
          type: "error",
          message: e.message,
        });
      });
  };
  const handleRequestList = (isRest = false) => {
    const text = selectedSearchByText
      ? {
          [selectedSearchBy.id]: isRest ? "" : selectedSearchByText,
        }
      : {};
    axios
      .get(`/user/requests?page=${page + 1}&limit=${rowsPerPage}`, {
        params: {
          lastName: isRest
            ? []
            : selectedSurname
                ?.filter((data) => data.name !== "All")
                ?.map((item) => item?.id),
          state: isRest
            ? []
            : selectedState
                ?.filter((data) => data.name !== "All")
                ?.map((item) => item?.id),
          region: isRest
            ? []
            : selectedRegion
                ?.filter((data) => data.name !== "All")
                ?.map((item) => item?.id),
          samaj: isRest
            ? []
            : selectedSamaj
                ?.filter((data) => data.name !== "All")
                ?.map((item) => item?.id),
          roles: isRest
            ? []
            : selectedRole
                ?.filter((data) => data.label !== "All")
                ?.map((item) => item?.value),
          ...text,
        },
      })
      .then((res) => {
        setUserList(res?.data);
      });
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedSearchBy({
      label: "",
      id: "",
    });
    setSelectedSurname([]);
    setSelectedState([]);
    setSelectedRegion([]);
    setSelectedSamaj([]);
    setSelectedRole([]);
    handleRequestList(true);
  };
  const handleSelectedUser = (ids) => {
    setSelectedUsers([...ids]);
  };
  const handleRequestAll = async (action) => {
    axios
      .patch(`/user/approveRejectMany`, {
        ids: selectedUsers,
        action,
      })
      .then((res) => {
        handleRequestList();
        setNotification({ type: "success", message: "Success !" });
      })
      .catch((e) => {
        setNotification({
          type: "error",
          message: e.message,
        });
      });
  };
  const pendingUsersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{surname.find((item) => item?.id === record?.row?.lastName)?.name}</>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => <>{record?.row?.gender || "-"}</>,
    },
    {
      field: "region",
      headerName: "Region",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{region.find((item) => item?.id === record?.row?.region)?.name}</>
      ),
    },
    {
      field: "localSamaj",
      headerName: "Local Samaj",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{samaj.find((item) => item?.id === record?.row?.localSamaj)?.name}</>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 3,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <Tooltip title={"Details"}>
            <Button
              variant="text"
              className={""}
              onClick={() => requestInfoModalOpen(record.row)}
            >
              <VisibilityIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Accept"}>
            <Button
              variant="text"
              className={"!text-[#34c375]"}
              onClick={() => userActionHandler(record.row, true)}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Reject"}>
            <Button
              variant="text"
              className={"!text-[#ff0000]"}
              onClick={() => userActionHandler(record.row, false)}
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <div className={"justify-between flex items-center w-full"}>
          <p className={"text-3xl font-bold"}>Pending Requests</p>
          <div className="">
            <Tooltip title={"Accept all selected"}>
              <button
                className={
                  "bg-[#572a2a] border text-white rounded p-2 hover:scale-105"
                }
                onClick={() => handleRequestAll("accept")}
              >
                <PlaylistAddCheckIcon /> Accept{" "}
                {selectedUsers?.length > 0 ? `(${selectedUsers?.length})` : ""}
              </button>
            </Tooltip>
            <Tooltip title={"Reject all selected"} className="ml-3">
              <button
                className={
                  "bg-white text-[#572a2a] border border-[#572a2a] rounded p-2 hover:scale-105"
                }
                onClick={() => handleRequestAll("reject")}
              >
                <PlaylistRemoveIcon /> Reject{" "}
                {selectedUsers?.length > 0 ? `(${selectedUsers?.length})` : ""}
              </button>
            </Tooltip>
          </div>
        </div>
        <Accordion
          className={"w-full rounded"}
          expanded={expanded}
          onChange={handleExpansion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={"text-primary"} />}
            aria-controls="panel1-content"
            id="panel1-header"
            className={"text-primary font-extrabold text-[18px]"}
          >
            Filter & Search
          </AccordionSummary>
          <AccordionDetails className={"p-4"}>
            <Grid spacing={2} container>
              <CustomAutoComplete
                list={[
                  {
                    label: "All",
                    value: "all",
                    name: "All",
                    id: "",
                  },
                  ...setLabelValueInList(surname),
                ]}
                multiple={true}
                label={"Surname"}
                placeholder={"Select Your Last Name"}
                xs={3}
                value={selectedSurname}
                name="surname"
                onChange={(e, lastName) => {
                  if (lastName) {
                    setSelectedSurname((pre) =>
                      (lastName.map((item) => item.name).includes("All") &&
                        lastName?.length === 1) ||
                      (lastName.map((item) => item.name).includes("All") &&
                        lastName
                          .map((item) => item.name)
                          ?.findIndex((data) => data === "All") !== 0)
                        ? [
                            {
                              label: "All",
                              value: "all",
                              name: "All",
                              id: "",
                            },
                          ]
                        : pre
                            .map((item) => item.name)
                            ?.find((data) => data === e.target.innerText)
                        ? [...pre]
                        : [...lastName].filter((item) => item.name !== "All")
                    );
                  }
                }}
              />
              <CustomAutoComplete
                list={[
                  {
                    label: "All",
                    value: "all",
                    name: "All",
                    id: "",
                  },
                  ...setLabelValueInList(state),
                ]}
                multiple={true}
                label={"State"}
                placeholder={"Select Your State"}
                xs={3}
                name="state"
                value={selectedState}
                onChange={(e, state) => {
                  if (state) {
                    setSelectedState((pre) =>
                      (state.map((item) => item.name).includes("All") &&
                        state?.length === 1) ||
                      (state.map((item) => item.name).includes("All") &&
                        state
                          .map((item) => item.name)
                          ?.findIndex((data) => data === "All") !== 0)
                        ? [
                            {
                              label: "All",
                              value: "all",
                              name: "All",
                              id: "",
                            },
                          ]
                        : pre
                            .map((item) => item.name)
                            ?.find((data) => data === e.target.innerText)
                        ? [...pre]
                        : [...state].filter((item) => item.name !== "All")
                    );
                  }
                }}
              />
              <CustomAutoComplete
                list={[
                  {
                    label: "All",
                    value: "all",
                    name: "All",
                    id: "",
                  },
                  ...setLabelValueInList(region),
                ]}
                multiple={true}
                label={"Region"}
                placeholder={"Select Your Region"}
                xs={3}
                name="region"
                value={selectedRegion}
                onChange={(e, region) => {
                  if (region) {
                    setSelectedRegion((pre) =>
                      (region.map((item) => item.name).includes("All") &&
                        region?.length === 1) ||
                      (region.map((item) => item.name).includes("All") &&
                        region
                          .map((item) => item.name)
                          ?.findIndex((data) => data === "All") !== 0)
                        ? [
                            {
                              label: "All",
                              value: "all",
                              name: "All",
                              id: "",
                            },
                          ]
                        : pre
                            .map((item) => item.name)
                            ?.find((data) => data === e.target.innerText)
                        ? [...pre]
                        : [...region].filter((item) => item.name !== "All")
                    );
                  }
                }}
              />
              <CustomAutoComplete
                list={[
                  {
                    label: "All",
                    value: "all",
                    name: "All",
                    id: "",
                  },
                  ...setLabelValueInList(samaj),
                ]}
                multiple={true}
                label={"Samaj"}
                placeholder={"Select Your Samaj"}
                xs={3}
                name="samaj"
                value={selectedSamaj}
                onChange={(e, samaj) => {
                  if (samaj) {
                    setSelectedSamaj((pre) =>
                      (samaj.map((item) => item.name).includes("All") &&
                        samaj?.length === 1) ||
                      (samaj.map((item) => item.name).includes("All") &&
                        samaj
                          .map((item) => item.name)
                          ?.findIndex((data) => data === "All") !== 0)
                        ? [
                            {
                              label: "All",
                              value: "all",
                              name: "All",
                              id: "",
                            },
                          ]
                        : pre
                            .map((item) => item.name)
                            ?.find((data) => data === e.target.innerText)
                        ? [...pre]
                        : [...samaj].filter((item) => item.name !== "All")
                    );
                  }
                }}
              />
              {auth.user.role === "ADMIN" && (
                <CustomAutoComplete
                  xs={3}
                  multiple={true}
                  list={[
                    {
                      label: "All",
                      value: "all",
                      name: "All",
                      id: "",
                    },
                    {
                      label: "Admin",
                      value: "ADMIN",
                    },
                    {
                      label: "Samaj Manager",
                      value: "SAMAJ_MANAGER",
                    },
                    {
                      label: "Region Manager",
                      value: "REGION_MANAGER",
                    },
                    {
                      label: "User",
                      value: "USER",
                    },
                  ]}
                  label={"Role"}
                  name="role"
                  value={selectedRole}
                  onChange={(e, role) => {
                    if (role) {
                      setSelectedRole((pre) =>
                        (role.map((item) => item.label).includes("All") &&
                          role?.length === 1) ||
                        (role.map((item) => item.label).includes("All") &&
                          role
                            .map((item) => item.label)
                            ?.findIndex((data) => data === "All") !== 0)
                          ? [
                              {
                                label: "All",
                                value: "all",
                                name: "All",
                                id: "",
                              },
                            ]
                          : pre
                              .map((item) => item.label)
                              ?.find((data) => data === e.target.innerText)
                          ? [...pre]
                          : [...role].filter((item) => item.label !== "All")
                      );
                    }
                  }}
                />
              )}
              <CustomAutoComplete
                list={[
                  {
                    value: "familyId",
                    label: "Family Id",
                  },
                  {
                    value: "firstName",
                    label: "First Name",
                  },
                  {
                    value: "mobile",
                    label: "Mobile",
                  },
                  {
                    value: "email",
                    label: "Email",
                  },
                  {
                    value: "gender",
                    label: "Gender",
                  },
                ]}
                label={"Search By"}
                placeholder={"Select Your Search By"}
                xs={3}
                name="search"
                value={selectedSearchBy.label}
                onChange={(e, search) => {
                  setSelectedSearchBy({
                    label: search.label,
                    id: search.value,
                  });
                }}
              />
              <CustomInput
                type={"text"}
                placeholder={"Enter Search Text"}
                name={"firstName"}
                xs={3}
                value={selectedSearchByText}
                onChange={(e) => {
                  setSelectedSearchByText(e.target.value)
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
                  selectedState?.length > 0 ||
                  selectedRegion?.length > 0 ||
                  selectedSurname?.length > 0 ||
                  selectedSamaj?.length > 0 ||
                  selectedRole?.length > 0) && (
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
          </AccordionDetails>
        </Accordion>
        <CustomTable
          columns={pendingUsersTableHeader}
          data={userList}
          name={"pendingUser"}
          pageSize={rowsPerPage}
          type={"pendingList"}
          className={"mx-0 w-full"}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          onRowSelectionModelChange={(ids) => handleSelectedUser(ids)}
        />
      </ContainerPage>
      <Modal
        open={requestInfoModel}
        onClose={requestInfoModalClose}
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
        <Paper elevation={10} className="!rounded-2xl p-4 w-1/2">
          <Grid container spacing={2} className="p-4">
            <Grid xs={12} className={"flex justify-between w-full"}>
              <span className={"text-xl font-bold"}>View Detail</span>
              <CloseIcon
                onClick={requestInfoModalClose}
                className={"cursor-pointer"}
              />
            </Grid>
            <CustomTextFieldInfo
              grid={12}
              label={"Family Id"}
              value={selectedUser?.familyId}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"First Name"}
              value={selectedUser?.firstName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Middle Name"}
              value={selectedUser?.middleName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Last Name"}
              value={
                surname.find((item) => item?.id === selectedUser?.lastName)
                  ?.name
              }
            />
            <CustomTextFieldInfo
              grid={6}
              label={"E-mail"}
              value={selectedUser?.email}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Mobile"}
              value={selectedUser?.mobile}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Region"}
              value={
                region.find((item) => item?.id === selectedUser?.region)?.name
              }
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Local Samaj"}
              value={
                samaj.find((item) => item?.id === selectedUser?.localSamaj)
                  ?.name
              }
            />
          </Grid>
        </Paper>
      </Modal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
