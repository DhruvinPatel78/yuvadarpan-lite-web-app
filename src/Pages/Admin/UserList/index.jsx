import React, { useEffect, useRef, useState } from "react";
import CustomTable from "../../../Component/Common/customTable";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Header from "../../../Component/Header";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomInput from "../../../Component/Common/customInput";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import ContainerPage from "../../../Component/Container";
import ConfirmModal, {
  getDeleteDescription,
} from "../../../Component/Common/ConfirmModal";
import AddIcon from "@mui/icons-material/Add";
import CustomRadio from "../../../Component/Common/customRadio";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import {
  getSelectedData,
  handleListById,
  listHandler,
  requestFilterList,
  rolesList,
  useFilteredIds,
  getListById,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
} from "../../../util/userApi";
import { getSamajByCity } from "../../../util/samajApi";

const MOBILE_PAGE_SIZE = 20;

function Index() {
  const dispatch = useDispatch();
  const { loading, surname, region, samaj, country, auth } = UseRedux();
  const isSamajManager =
    String(auth?.user?.role || "").toUpperCase() === "SAMAJ_MANAGER";
  const isCityManager =
    String(auth?.user?.role || "").toUpperCase() === "CITY_MANAGER";
  const isDistrictManager =
    String(auth?.user?.role || "").toUpperCase() === "DISTRICT_MANAGER";
  const isRegionManager =
    String(auth?.user?.role || "").toUpperCase() === "REGION_MANAGER";
  const isStateManager =
    String(auth?.user?.role || "").toUpperCase() === "STATE_MANAGER";
  const isCountryManager =
    String(auth?.user?.role || "").toUpperCase() === "COUNTRY_MANAGER";
  const hasOwnListToggle =
    isSamajManager ||
    isCityManager ||
    isDistrictManager ||
    isRegionManager ||
    isStateManager ||
    isCountryManager;
  const [ownUserList, setOwnUserList] = useState(false);
  const canAct = !hasOwnListToggle || ownUserList;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [mobilePage, setMobilePage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isMobile = useMediaQuery("(max-width:767.95px)");
  const loadingMoreLock = useRef(false);
  const loadMoreRef = useRef(null);
  const { notification, setNotification } = NotificationData();
  const [userInfoModel, setUserInfoModel] = useState(false);
  const [isAddUser, setIsAddUser] = useState(false);
  const [userList, setUserList] = useState(null);
  const [selectedLastName, setSelectedLastName] = useState(null);
  const [selectedCountryName, setSelectedCountryName] = useState(null);
  const [selectedStateName, setSelectedStateName] = useState(null);
  const [selectedRegionName, setSelectedRegionName] = useState(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [selectedSamajName, setSelectedSamajName] = useState(null);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    name: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [samajList, setSamajList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [list, setList] = useState({
    country: [],
    region: [],
    lastName: [],
  });
  const [selectedRole, setSelectedRole] = useState([]);
  const [samajListByRegion, setSamajListByRegion] = useState(samaj);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formik = useFormik({
    initialValues: {
      familyId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      active: false,
      allowed: false,
      region: "",
      country: "",
      state: "",
      district: "",
      city: "",
      localSamaj: "",
      dob: "",
      gender: "",
      role: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, role, country, state, district, city, ...rest } = values;
        const roleValue =
          isSamajManager || isCityManager || isDistrictManager || isRegionManager || isStateManager || isCountryManager
            ? "USER"
            : role?.value || role?.id || (typeof role === "string" ? role : "") || "USER";
        if (isAddUser) {
          await addUser({
            ...rest,
            role: roleValue,
          });
        } else {
          await updateUser(rest.id, { ...rest, role: roleValue });
        }
        userInfoModalClose();
        handleUserList();
        resetForm();
      } catch (e) {
        setNotification({
          type: "error",
          message: e?.response?.data?.message || "Failed to save user.",
        });
      } finally {
        dispatch(endLoading());
      }
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      familyId: Yup.number()
        .typeError("Must be a number")
        .positive()
        .required("Required"),
      mobile: Yup.number().typeError("Must be a number").required("Required"),
      email: Yup.string().email().required("Required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .test({
          message: "Password not match",
          test: function (value) {
            return value === values.password;
          },
        }),
    }),
  });
  const {
    errors,
    values,
    setValues,
    resetForm,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  } = formik;

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredRegionIds = useFilteredIds(selectedRegion, "id");
  const filteredRolesIds = useFilteredIds(selectedRole, "id");
  const filteredSamajIds = useFilteredIds(selectedSamaj, "id");

  const handleUserList = async (isRest = false, options = {}) => {
    const append = Boolean(options.append);
    const limit = isMobile ? MOBILE_PAGE_SIZE : rowsPerPage;
    const pageNum = append ? options.pageNum : isMobile ? 1 : page + 1;
    try {
      const text = selectedSearchByText
        ? {
            [selectedSearchBy.id]: isRest ? "" : selectedSearchByText,
          }
        : {};
      if (append) {
        setLoadingMore(true);
      } else if (isMobile) {
        setMobilePage(1);
      }
      const params = {
        page: pageNum,
        limit,
        lastName: isRest ? [] : filteredSurnameIds,
        roles: isRest ? [] : filteredRolesIds,
        region: isRest ? [] : filteredRegionIds,
        samaj: isRest ? [] : filteredSamajIds,
        ...text,
      };
      if (isSamajManager) {
        params.ownSamaj = ownUserList;
      }
      if (isCityManager) {
        params.ownCity = ownUserList;
      }
      if (isDistrictManager) {
        params.ownDistrict = ownUserList;
      }
      if (isRegionManager) {
        params.ownRegion = ownUserList;
      }
      if (isStateManager) {
        params.ownState = ownUserList;
      }
      if (isCountryManager) {
        params.ownCountry = ownUserList;
      }
      const data = await getUserList(params);
      setUserList((prev) => {
        if (!append) {
          return data;
        }
        const existingIds = new Set((prev?.data || []).map((item) => item.id));
        const incoming = (data?.data || []).filter(
          (item) => !existingIds.has(item.id)
        );
        return {
          ...data,
          data: [...(prev?.data || []), ...incoming],
        };
      });
      setHasMore(
        (data?.data?.length || 0) === limit &&
          pageNum * limit < (data?.total || 0)
      );
    } catch (e) {
      // Optionally handle error with notification
    } finally {
      if (append) {
        setLoadingMore(false);
        loadingMoreLock.current = false;
      }
    }
  };

  useEffect(() => {
    handleUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ownUserList, isMobile]);

  const loadMoreUsers = () => {
    if (!isMobile || loadingMoreLock.current || loadingMore || !hasMore) {
      return;
    }
    if (!(userList?.data?.length)) {
      return;
    }
    loadingMoreLock.current = true;
    const nextPage = mobilePage + 1;
    setMobilePage(nextPage);
    handleUserList(false, { append: true, pageNum: nextPage });
  };

  useEffect(() => {
    if (!isMobile) {
      return undefined;
    }
    const target = loadMoreRef.current;
    if (!target) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreUsers();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, hasMore, mobilePage, loadingMore]);

  const userInfoModalOpen = (userInfo) => {
    setUserInfoModel(true);
    setList((pre) => ({
      ...pre,
      lastName: surname.map((data) => ({
        ...data,
        label: data.name,
        value: data.id,
      })),
      country: country.map((data) => ({
        ...data,
        label: data.name,
        value: data.id,
      })),
      region: region.map((data) => ({
        ...data,
        label: data.name,
        value: data.id,
      })),
    }));
    if (isAddUser === false) {
      setValues((pre) => ({
        ...pre,
        ...userInfo,
        password: "",
        region: userInfo?.region || "",
        localSamaj: userInfo?.localSamaj || "",
        dob: userInfo?.dob || "",
        gender: userInfo?.gender || "",
        role: userInfo?.role || "",
      }));
      setSelectedLastName(
        surname.find((item) => item?.id === userInfo?.lastName)?.name
      );
    }
  };

  const userActionHandler = async (userInfo, action, field) => {
    try {
      await updateUser(userInfo?.id, { [field]: action });
      if (isMobile) {
        setUserList((prev) => ({
          ...prev,
          data: (prev?.data || []).map((item) =>
            item.id === userInfo.id ? { ...item, [field]: action } : item
          ),
        }));
      } else {
        handleUserList();
      }
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const userInfoModalClose = () => {
    setUserInfoModel(false);
    setIsAddUser(false);
    setSelectedLastName(null);
    setSelectedCountryName(null);
    setSelectedStateName(null);
    setSelectedRegionName(null);
    setSelectedDistrictName(null);
    setSelectedCityName(null);
    setSelectedSamajName(null);
    setStateList([]);
    setRegionList([]);
    setDistrictList([]);
    setCityList([]);
    setSamajList([]);
    resetForm();
  };

  const getStateList = async (countryId) => {
    try {
      const data = await getListById("state", countryId);
      setStateList(data || []);
    } catch (e) {
      setStateList([]);
    }
  };

  const getRegionList = async (stateId) => {
    try {
      const data = await getListById("region", stateId);
      setRegionList(data || []);
    } catch (e) {
      setRegionList([]);
    }
  };

  const getDistrictList = async (regionId) => {
    try {
      const data = await getListById("district", regionId);
      setDistrictList(data || []);
    } catch (e) {
      setDistrictList([]);
    }
  };

  const getCityList = async (districtId) => {
    try {
      const data = await getListById("city", districtId);
      setCityList(data || []);
    } catch (e) {
      setCityList([]);
    }
  };

  const getSamajList = async (cityId) => {
    try {
      const data = await getSamajByCity(cityId);
      setSamajList(
        (data || []).map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }))
      );
    } catch (e) {
      setSamajList([]);
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedSearchBy({
      label: "",
      id: "",
    });
    setSelectedSurname([]);
    setSelectedRegion([]);
    setSelectedSamaj([]);
    setSelectedRole([]);
    setSamajListByRegion(samaj);
    handleUserList(true);
  };

  const usersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{surname.find((item) => item?.id === record?.row?.lastName)?.name}</>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "allowed",
      headerName: "Allowed",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <CustomSwitch
            checked={record?.row?.allowed}
            disabled={!canAct}
            onClick={(e) => {
              if (!canAct) return;
              userActionHandler(record?.row, !record?.row?.allowed, "allowed");
            }}
          />
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
            disabled={!canAct}
            onClick={(e) => {
              if (!canAct) return;
              userActionHandler(record?.row, !record?.row?.active, "active");
            }}
          />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName:
        "items-center justify-center flex px-8 outline-none cursor-pointer",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => userInfoModalOpen(record?.row)}
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setDeleteTarget(record?.row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ].filter(
    (column) =>
      (canAct || column.field !== "action") &&
      (!hasOwnListToggle || column.field !== "role")
  );

  const deleteAPI = async (id) => {
    try {
      const ids = Array.isArray(id) ? id : [id];
      await deleteUser(ids);
      if (isMobile) {
        setUserList((prev) => ({
          ...prev,
          data: (prev?.data || []).filter((item) => !ids.includes(item.id)),
          total: Math.max(0, (prev?.total || 0) - ids.length),
        }));
        setSelectedUsers([]);
      } else {
        handleUserList();
      }
    } catch (error) {
      // Optionally handle error with notification
    }
  };

  const users = userList?.data || [];
  const lookupName = (list, id) =>
    list?.find((item) => item?.id === id)?.name || "-";

  const toggleCardSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const hasError = Object.keys(errors)?.length || 0;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={" flex-col justify-center flex items-start gap-4"}
      >
        <div className={"w-full justify-between flex items-center gap-3"}>
          <p className={"text-3xl font-bold"}>Users</p>
          <div className={"flex items-center gap-3"}>
            {hasOwnListToggle ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={ownUserList}
                    onChange={(e) => {
                      setOwnUserList(e.target.checked);
                      setPage(0);
                    }}
                  />
                }
                label={
                  <span className={"font-semibold text-[#572a2a]"}>
                    {isCityManager ||
                    isDistrictManager ||
                    isRegionManager ||
                    isStateManager ||
                    isCountryManager
                      ? "Your Userlist"
                      : "Your Users"}
                  </span>
                }
              />
            ) : null}
            {canAct ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className={"bg-primary"}
                onClick={() => {
                  userInfoModalOpen();
                  setUserInfoModel(!userInfoModel);
                  setIsAddUser(true);
                }}
              >
                Add User
              </Button>
            ) : null}
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
                    getSelectedData(pre, lastName, e)
                  );
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(region)}
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
            {hasOwnListToggle ? null : (
            <CustomAutoComplete
              list={rolesList()}
              multiple={true}
              label={"Role"}
              placeholder={"Select Your role"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="role"
              value={selectedRole}
              onChange={(e, role) => {
                if (
                  role &&
                  !selectedRole.some((item) => item.name === e.target.innerText)
                ) {
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
                  handleUserList(true);
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
                onClick={() => handleUserList()}
              >
                Submit
              </button>
              {(selectedSearchByText ||
                selectedSearchBy.name ||
                // selectedState?.length > 0 ||
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
        {canAct && selectedUsers.length > 0 ? (
          <div
            className={
              "md:hidden w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-[#fff5f4] border border-[#572a2a] rounded-lg"
            }
          >
            <span className={"text-[#572a2a] font-semibold"}>
              {selectedUsers.length} selected
            </span>
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              className={"!bg-[#572a2a] !text-white"}
              onClick={() => deleteAPI(selectedUsers)}
            >
              Delete Selected
            </Button>
          </div>
        ) : null}
        <div className={"hidden md:block w-full"}>
          <CustomTable
            columns={usersTableHeader}
            data={userList}
            name={"users"}
            pageSize={rowsPerPage}
            setPageSize={setRowsPerPage}
            type={"userList"}
            className={"mx-0 w-full"}
            page={page}
            setPage={setPage}
            onDeleteSelected={canAct ? deleteAPI : undefined}
          />
        </div>
        <div className={"md:hidden w-full flex flex-col gap-3"}>
          {users.length ? (
            users.map((row) => {
              const fullName = [row.firstName, row.middleName]
                .filter(Boolean)
                .join(" ");
              const lastName = lookupName(surname, row.lastName);
              const isSelected = selectedUsers.includes(row.id);
              return (
                <Paper
                  key={row.id}
                  elevation={2}
                  className={"rounded-xl overflow-hidden border border-[#ead9d9]"}
                >
                  <div className={"p-3"}>
                    <div className={"flex items-center justify-between gap-2"}>
                      <p className={"font-bold text-[#572a2a] text-base leading-tight min-w-0 pr-1"}>
                        {fullName} {lastName}
                      </p>
                      {canAct ? (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleCardSelection(row.id)}
                          className={"!text-[#572a2a] !p-0 !m-0 shrink-0"}
                        />
                      ) : null}
                    </div>
                    <p className={"text-sm text-gray-600 mt-1"}>
                      Family ID: {row.familyId || "-"}
                    </p>
                    <p className={"text-sm text-gray-600 break-all"}>
                      {row.email || "-"}
                    </p>
                    {hasOwnListToggle ? null : (
                      <p className={"text-sm text-gray-600"}>
                        Role: {row.role || "-"}
                      </p>
                    )}
                    <div className={"flex items-center gap-4 mt-2"}>
                      <div className={"flex items-center gap-1"}>
                        <span className={"text-sm text-gray-600"}>Allowed</span>
                        <CustomSwitch
                          checked={row.allowed}
                          disabled={!canAct}
                          onClick={() => {
                            if (!canAct) return;
                            userActionHandler(row, !row.allowed, "allowed");
                          }}
                        />
                      </div>
                      <div className={"flex items-center gap-1"}>
                        <span className={"text-sm text-gray-600"}>Active</span>
                        <CustomSwitch
                          checked={row.active}
                          disabled={!canAct}
                          onClick={() => {
                            if (!canAct) return;
                            userActionHandler(row, !row.active, "active");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {canAct ? (
                    <div className={"flex border-t border-[#ead9d9]"}>
                      <button
                        type="button"
                        className={"flex-1 py-2.5 text-sm font-semibold text-[#572a2a] border-r border-[#ead9d9]"}
                        onClick={() => userInfoModalOpen(row)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={"flex-1 py-2.5 text-sm font-semibold text-[#ff0000]"}
                        onClick={() => setDeleteTarget(row)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </Paper>
              );
            })
          ) : (
            <Paper className={"p-6 text-center text-gray-500 rounded-xl"}>
              No users
            </Paper>
          )}
          {hasMore && users.length ? (
            <div ref={loadMoreRef} className={"flex justify-center py-3"}>
              {loadingMore ? (
                <CircularProgress size={24} className={"!text-[#572a2a]"} />
              ) : null}
            </div>
          ) : null}
        </div>
      </ContainerPage>
      <Modal
        open={userInfoModel}
        onClose={userInfoModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          "& .MuiModal-backdrop": {
            backdropFilter: " blur(2px) !important",
            background: "#878b9499 !important",
          },
        }}
        className="flex justify-center items-center m-4"
      >
        <Paper elevation={10} className="!rounded-2xl p-4 w-full max-w-[600px]">
          <div className={"flex justify-between items-center"}>
            <Typography className={"font-bold text-2xl"}>
              {`${isAddUser ? `New` : `Update`} User`}
            </Typography>
            <HighlightOffIcon
              onClick={userInfoModalClose}
              className={"cursor-pointer"}
            />
          </div>
          <FormikProvider value={formik}>
            <Form
              className={
                "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
              }
            >
              <Grid container className={"w-full pt-4"} spacing={2}>
                <Grid item xs={12}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"familyId"}
                      id="familyId"
                      label="Family ID"
                      value={values?.familyId}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched?.familyId &&
                        errors?.familyId &&
                        errors?.familyId
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"firstName"}
                      id="firstName"
                      label="First Name"
                      value={values?.firstName}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched?.firstName &&
                        errors?.firstName &&
                        errors?.firstName
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"middleName"}
                      id="middleName"
                      label="Middle Name"
                      value={values?.middleName}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched?.middleName &&
                        errors?.middleName &&
                        errors?.middleName
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl className={"w-full"}>
                    <CustomAutoComplete
                      list={list.lastName}
                      label={"Last Name"}
                      placeholder={"Select Your Last Name"}
                      name="lastName"
                      value={selectedLastName}
                      errors={
                        touched.lastName && errors.lastName && errors.lastName
                      }
                      onChange={(e, lastName) => {
                        setFieldValue("lastName", lastName?.id);
                        setSelectedLastName(lastName?.name);
                      }}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"email"}
                      id="email"
                      label="Email"
                      value={values?.email}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched?.email && errors?.email && errors?.email}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"mobile"}
                      id="mobile"
                      label="Mobile"
                      value={values?.mobile}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched?.mobile && errors?.mobile && errors?.mobile
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"password"}
                      id="password"
                      label="Password"
                      value={values?.password}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched?.password &&
                        errors?.password &&
                        errors?.password
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl className={"w-full"}>
                    <CustomInput
                      name={"confirmPassword"}
                      id="confirmPassword"
                      label="Confirm Password"
                      value={values?.confirmPassword}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        touched?.confirmPassword &&
                        errors?.confirmPassword &&
                        errors?.confirmPassword
                      }
                    />
                  </FormControl>
                </Grid>
                {isAddUser ? (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={list.country}
                          label={"Country"}
                          placeholder={"Select Your Country"}
                          name={"country"}
                          value={selectedCountryName}
                          errors={
                            touched?.country &&
                            errors?.country &&
                            errors?.country
                          }
                          onChange={(e, selectedCountry) => {
                            setFieldValue("country", selectedCountry?.id);
                            setFieldValue("state", "");
                            setFieldValue("region", "");
                            setFieldValue("district", "");
                            setFieldValue("city", "");
                            setFieldValue("localSamaj", "");
                            setSelectedCountryName(selectedCountry?.name);
                            setSelectedStateName(null);
                            setSelectedRegionName(null);
                            setSelectedDistrictName(null);
                            setSelectedCityName(null);
                            setSelectedSamajName(null);
                            setRegionList([]);
                            setDistrictList([]);
                            setCityList([]);
                            setSamajList([]);
                            if (selectedCountry?.id) getStateList(selectedCountry.id);
                            else setStateList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={stateList}
                          label={"State"}
                          placeholder={"Select Your State"}
                          name={"state"}
                          value={selectedStateName}
                          disabled={!selectedCountryName}
                          errors={
                            touched?.state && errors?.state && errors?.state
                          }
                          onChange={(e, selectedState) => {
                            setFieldValue("state", selectedState?.id);
                            setFieldValue("region", "");
                            setFieldValue("district", "");
                            setFieldValue("city", "");
                            setFieldValue("localSamaj", "");
                            setSelectedStateName(selectedState?.name);
                            setSelectedRegionName(null);
                            setSelectedDistrictName(null);
                            setSelectedCityName(null);
                            setSelectedSamajName(null);
                            setDistrictList([]);
                            setCityList([]);
                            setSamajList([]);
                            if (selectedState?.id) getRegionList(selectedState.id);
                            else setRegionList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={regionList}
                          label={"Region"}
                          placeholder={"Select Your Region"}
                          name={"region"}
                          value={selectedRegionName}
                          disabled={!selectedStateName}
                          errors={
                            touched?.region && errors?.region && errors?.region
                          }
                          onChange={(e, region) => {
                            setFieldValue("region", region?.id);
                            setFieldValue("district", "");
                            setFieldValue("city", "");
                            setFieldValue("localSamaj", "");
                            setSelectedRegionName(region?.name);
                            setSelectedDistrictName(null);
                            setSelectedCityName(null);
                            setSelectedSamajName(null);
                            setCityList([]);
                            setSamajList([]);
                            if (region?.id) getDistrictList(region.id);
                            else setDistrictList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={districtList}
                          label={"District"}
                          placeholder={"Select Your District"}
                          name={"district"}
                          value={selectedDistrictName}
                          disabled={!selectedRegionName}
                          errors={
                            touched?.district &&
                            errors?.district &&
                            errors?.district
                          }
                          onChange={(e, district) => {
                            setFieldValue("district", district?.id);
                            setFieldValue("city", "");
                            setFieldValue("localSamaj", "");
                            setSelectedDistrictName(district?.name);
                            setSelectedCityName(null);
                            setSelectedSamajName(null);
                            setSamajList([]);
                            if (district?.id) getCityList(district.id);
                            else setCityList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={cityList}
                          label={"City"}
                          placeholder={"Select Your City"}
                          name={"city"}
                          value={selectedCityName}
                          disabled={!selectedDistrictName}
                          errors={
                            touched?.city && errors?.city && errors?.city
                          }
                          onChange={(e, city) => {
                            setFieldValue("city", city?.id);
                            setFieldValue("localSamaj", "");
                            setSelectedCityName(city?.name);
                            setSelectedSamajName(null);
                            if (city?.id) getSamajList(city.id);
                            else setSamajList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={samajList}
                          label={"Local Samaj"}
                          placeholder={"Select Your Samaj"}
                          name={"localSamaj"}
                          value={selectedSamajName}
                          disabled={!selectedCityName}
                          errors={
                            touched?.localSamaj &&
                            errors?.localSamaj &&
                            errors?.localSamaj
                          }
                          onChange={(e, localSamaj) => {
                            setFieldValue("localSamaj", localSamaj?.id);
                            setSelectedSamajName(localSamaj?.name);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomInput
                          type={"date"}
                          label={"DOB"}
                          placeholder={"Select Your DOB"}
                          name="dob"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={touched.dob && errors.dob && errors.dob}
                          value={values.dob}
                          focused
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomRadio
                          list={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                          ]}
                          label={"Gender"}
                          name={"gender"}
                          value={values?.gender}
                          errors={
                            touched?.gender && errors?.gender && errors?.gender
                          }
                          className={"flex flex-row"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    {hasOwnListToggle ? null : (
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={rolesList(false)}
                          label={"User Role"}
                          placeholder={"Select Your User Role"}
                          name={"role"}
                          value={
                            typeof values?.role === "object" && values?.role
                              ? values.role
                              : null
                          }
                          errors={touched?.role && errors?.role && errors?.role}
                          onChange={(e, role) => {
                            setFieldValue("role", role);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    )}
                  </>
                ) : null}
                <Grid
                  item
                  xs={12}
                  className={"flex justify-center items-center"}
                >
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <button
                      className={`bg-[#572a2a] text-white w-full p-3 normal-case text-base rounded-lg font-bold transition-all ${
                        hasError ? "opacity-50" : "opacity-100"
                      }`}
                      type={"submit"}
                      disabled={hasError}
                    >
                      {isAddUser ? "Add" : "Update"}
                    </button>
                  )}
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Paper>
      </Modal>
      <NotificationSnackbar notification={notification} />
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete confirmation"
        description={getDeleteDescription(deleteTarget?.firstName)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deleteAPI(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}

export default Index;
