import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Modal, Paper, Tooltip } from "@mui/material";
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
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import {
  getSelectedData,
  handleListById,
  listHandler,
  requestFilterList,
  rolesList,
  useFilteredIds,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";

export default function Index() {
  const { notification, setNotification } = NotificationData();
  const { auth, samaj, region, state, surname } = UseRedux();
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
  const [regionListByState, setRegionListByState] = useState(region);
  const [samajListByRegion, setSamajListByRegion] = useState(samaj);
  const dispatch = useDispatch();

  useEffect(() => {
    handleRequestList(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setSelectedUser(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };

  const userActionHandler = async (userInfo, action) => {
    dispatch(startLoading());
    try {
      await axios
        .patch(`/user/update/${userInfo._id}`, {
          // ...userInfo,
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
    } catch (e) {
      setNotification({
        type: "error",
        message: e.message,
      });
    } finally {
      dispatch(endLoading());
    }
  };

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredStateIds = useFilteredIds(selectedState, "id");
  const filteredRegionIds = useFilteredIds(selectedRegion, "id");
  const filteredSamajIds = useFilteredIds(selectedSamaj, "id");
  const filteredRolesIds = useFilteredIds(selectedRole, "value", "label");

  const handleRequestList = async (isRest = false) => {
    dispatch(startLoading());
    const text = selectedSearchByText
      ? { [selectedSearchBy.id]: isRest ? "" : selectedSearchByText }
      : {};
    try {
      const response = await axios.get(
        `/user/requests?page=${page + 1}&limit=${rowsPerPage}`,
        {
          params: {
            lastName: isRest ? [] : filteredSurnameIds,
            state: isRest ? [] : filteredStateIds,
            region: isRest ? [] : filteredRegionIds,
            samaj: isRest ? [] : filteredSamajIds,
            roles: isRest ? [] : filteredRolesIds,
            ...text,
          },
        },
      );
      setUserList(response?.data);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    } finally {
      dispatch(endLoading());
    }
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
    setRegionListByState(region);
    setSamajListByRegion(samaj);
    handleRequestList(true);
  };
  const handleSelectedUser = (ids) => {
    setSelectedUsers([...ids]);
  };
  const handleRequestAll = async (action) => {
    dispatch(startLoading());
    try {
      await axios
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
    } catch (e) {
      console.error("Error Updating user Approve Reject:", e);
    } finally {
      dispatch(endLoading());
    }
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
        <div
          className={
            "justify-between flex sm:items-center items-left w-full sm:flex-row flex-col gap-2"
          }
        >
          <p className={"text-3xl font-bold"}>Pending Requests</p>
          <div className="flex flex-row gap-3 sm:w-auto w-full">
            <Tooltip title={"Accept all selected"}>
              <button
                className={
                  "bg-[#572a2a] border text-white rounded p-2 hover:scale-105 w-full flex items-center justify-center"
                }
                onClick={() => handleRequestAll("accept")}
              >
                <PlaylistAddCheckIcon /> Accept{" "}
                {selectedUsers?.length > 0 ? `(${selectedUsers?.length})` : ""}
              </button>
            </Tooltip>
            <Tooltip title={"Reject all selected"}>
              <button
                className={
                  "bg-white text-[#572a2a] border border-[#572a2a] rounded p-2 hover:scale-105 w-full flex items-center justify-center"
                }
                onClick={() => handleRequestAll("reject")}
              >
                <PlaylistRemoveIcon /> Reject{" "}
                {selectedUsers?.length > 0 ? `(${selectedUsers?.length})` : ""}
              </button>
            </Tooltip>
          </div>
        </div>
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomAutoComplete
              list={listHandler(surname)}
              multiple={true}
              label={"Surname"}
              placeholder={"Select Your Last Name"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSurname}
              name="surname"
              onChange={(e, lastName) => {
                if (lastName) {
                  setSelectedSurname((pre) =>
                    getSelectedData(pre, lastName, e),
                  );
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(state)}
              multiple={true}
              label={"State"}
              placeholder={"Select Your State"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="state"
              value={selectedState}
              onChange={async (e, state) => {
                if (state) {
                  const Data = await handleListById("region", state);
                  setRegionListByState(Data);
                  setSelectedState((pre) => getSelectedData(pre, state, e));
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(regionListByState)}
              multiple={true}
              label={"Region"}
              placeholder={"Select Your Region"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="region"
              value={selectedRegion}
              onChange={async (e, region) => {
                if (region) {
                  const data = await handleListById("samaj", region);
                  setSamajListByRegion(data);
                  setSelectedRegion((pre) => getSelectedData(pre, region, e));
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(samajListByRegion)}
              multiple={true}
              label={"Samaj"}
              placeholder={"Select Your Samaj"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="samaj"
              value={selectedSamaj}
              onChange={(e, samaj) => {
                if (samaj) {
                  setSelectedSamaj((pre) => getSelectedData(pre, samaj, e));
                }
              }}
            />
            {auth.user.role === "ADMIN" && (
              <CustomAutoComplete
                xs={12}
                sm={6}
                md={4}
                lg={3}
                multiple={true}
                list={rolesList()}
                label={"Role"}
                name="role"
                value={selectedRole}
                onChange={(e, role) => {
                  if (role) {
                    setSelectedRole((pre) => getSelectedData(pre, role, e));
                  }
                }}
              />
            )}
            <CustomAutoComplete
              list={requestFilterList}
              label={"Search By"}
              placeholder={"Select Your Search By"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
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
                onClick={() => {
                  setPage(0);
                  handleRequestList();
                }}
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
        </CustomAccordion>
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
