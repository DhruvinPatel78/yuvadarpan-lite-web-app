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
  Paper,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import Header from "../../../Component/Header";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomInput from "../../../Component/Common/customInput";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import ContainerPage from "../../../Component/Container";
import LoadableImage from "../../../Component/Common/LoadableImage";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import AddIcon from "@mui/icons-material/Add";
import CustomRadio from "../../../Component/Common/customRadio";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import moment from "moment";
import { PageHeader, FilterActions, Button as ActionButton, AppModal, FormModal } from "../../../Component/UI";
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

function UserDetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mutedText">
        {label}
      </p>
      <p className="text-sm text-primary mt-0.5 break-words">{value || "-"}</p>
    </div>
  );
}

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
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

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
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
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
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "allowed",
      headerName: "Allowed",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
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
      headerClassName: "bg-primary text-white outline-none",
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
      headerClassName: "bg-primary text-white outline-none",
      cellClassName:
        "items-center justify-center flex px-8 outline-none cursor-pointer",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <Tooltip title={"View"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setViewUser(record?.row)}
            />
          </Tooltip>
          {canAct ? (
            <>
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
            </>
          ) : null}
        </div>
      ),
    },
  ].filter((column) => !hasOwnListToggle || column.field !== "role");

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
  const formatUserDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
  };
  const formatRole = (role) =>
    String(role || "-")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

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
        <PageHeader
          className="w-full"
          title="Users"
          actions={
          <div className={"flex flex-col-reverse md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto"}>
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
                  <span className={"font-semibold text-primary"}>
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
              <ActionButton
                className="max-md:w-full"
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  userInfoModalOpen();
                  setUserInfoModel(!userInfoModel);
                  setIsAddUser(true);
                }}
              >
                Add User
              </ActionButton>
            ) : null}
          </div>
          }
        />
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
              <FilterActions
                onSubmit={() => handleUserList()}
                onReset={handleReset}
                showReset={Boolean(
                  selectedSearchByText ||
                    selectedSearchBy.name ||
                    selectedRegion?.length > 0 ||
                    selectedSurname?.length > 0 ||
                    selectedSamaj?.length > 0 ||
                    selectedRole?.length > 0
                )}
              />
            </Grid>
          </Grid>
        </CustomAccordion>
        {canAct && selectedUsers.length > 0 ? (
          <div
            className={
              "md:hidden w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 bg-muted border border-line rounded-lg"
            }
          >
            <span className={"text-primary font-semibold"}>
              {selectedUsers.length} selected
            </span>
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              className={"!bg-primary !text-white max-md:!w-full"}
              onClick={() => setBulkDeleteOpen(true)}
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
            deleteEntity="user"
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
                    <div className={"flex items-start justify-between gap-2"}>
                      <p className={"font-bold text-primary text-base leading-tight min-w-0 pr-1 break-words"}>
                        {fullName} {lastName}
                      </p>
                      {canAct ? (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleCardSelection(row.id)}
                          className={"!text-primary !p-2 !-m-2 shrink-0"}
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
                    <div className={"flex flex-wrap items-center gap-x-4 gap-y-2 mt-2"}>
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
                        className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary border-r border-[#ead9d9]"}
                        onClick={() => setViewUser(row)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary border-r border-[#ead9d9]"}
                        onClick={() => userInfoModalOpen(row)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-[#ff0000]"}
                        onClick={() => setDeleteTarget(row)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className={"flex border-t border-[#ead9d9]"}>
                      <button
                        type="button"
                        className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary"}
                        onClick={() => setViewUser(row)}
                      >
                        View
                      </button>
                    </div>
                  )}
                </Paper>
              );
            })
          ) : (
            <Paper className={"p-8 text-center rounded-xl"}>
              <p className="text-sm font-semibold text-primary">No users</p>
              <p className="text-sm text-mutedText mt-1">Try a different search or clear filters.</p>
            </Paper>
          )}
          {hasMore && users.length ? (
            <div ref={loadMoreRef} className={"flex justify-center py-3"}>
              {loadingMore ? (
                <CircularProgress size={24} className={"!text-primary"} />
              ) : null}
            </div>
          ) : null}
        </div>
      </ContainerPage>
      <AppModal
        open={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        maxWidth="560px"
        className="p-4 sm:p-6 pt-7 max-h-[min(90dvh,90vh)] overflow-auto"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setViewUser(null)}
          className="absolute top-3 right-3 text-primary p-2 rounded-md hover:bg-muted min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1 md:top-4 md:right-4 flex items-center justify-center"
        >
          <CloseIcon fontSize="small" />
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pr-6">
          <LoadableImage
            src=""
            alt=""
            className="w-24 h-24 rounded-full pointer-events-none"
          />
          <div className="text-center sm:text-left min-w-0">
            <h2 className="text-lg font-semibold text-primary leading-snug break-words">
              {[viewUser?.firstName, viewUser?.middleName]
                .filter(Boolean)
                .join(" ")}{" "}
              {lookupName(surname, viewUser?.lastName)}
            </h2>
            <p className="text-sm text-mutedText mt-1">
              {formatRole(viewUser?.role)}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold tracking-wide bg-muted text-primary px-2.5 py-1 rounded-full">
              Family ID {viewUser?.familyId || "-"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6 pt-5 border-t border-line">
          <UserDetailItem
            label="Date of birth"
            value={
              viewUser?.dob && moment(viewUser.dob).isValid()
                ? moment(viewUser.dob).format("DD/MM/YYYY hh:mm A")
                : "-"
            }
          />
          <UserDetailItem label="Email" value={viewUser?.email} />
          <UserDetailItem label="Mobile" value={viewUser?.mobile} />
          <UserDetailItem label="Gender" value={viewUser?.gender} />
          <UserDetailItem label="Language" value={viewUser?.language} />
          <UserDetailItem
            label="Region"
            value={lookupName(region, viewUser?.region)}
          />
          <UserDetailItem
            label="Local Samaj"
            value={lookupName(samaj, viewUser?.localSamaj)}
          />
          <UserDetailItem
            label="Allowed"
            value={viewUser?.allowed ? "Yes" : "No"}
          />
          <UserDetailItem
            label="Active"
            value={viewUser?.active ? "Yes" : "No"}
          />
          <UserDetailItem
            label="Created at"
            value={formatUserDate(viewUser?.createdAt)}
          />
          <UserDetailItem
            label="Updated at"
            value={formatUserDate(viewUser?.updatedAt)}
          />
        </div>
      </AppModal>
      <FormModal
        open={userInfoModel}
        onClose={userInfoModalClose}
        title={`${isAddUser ? "New" : "Update"} User`}
        maxWidth="980px"
      >
          <FormikProvider value={formik}>
            <Form className="flex flex-col w-full">
              <Grid container className={"w-full"} spacing={1.5}>
                <Grid item xs={12} className="!pt-1">
                  <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-mutedText">
                    Identity
                  </p>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
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
                <Grid item xs={12} sm={4} md={4}>
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
                <Grid item xs={12} sm={4} md={4}>
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
                <Grid item xs={12} sm={4} md={4}>
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
                <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12}>
                      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-mutedText">
                        Location
                      </p>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControl className={"w-full"}>
                        <CustomInput
                          type={"date"}
                          label={"Date of birth"}
                          placeholder={"Select Your DOB"}
                          name="dob"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={touched.dob && errors.dob && errors.dob}
                          value={values.dob}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
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
                    <Grid item xs={12} sm={4} md={4}>
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
                  className={"flex justify-end items-center !pt-2"}
                >
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <ActionButton
                      type={"submit"}
                      disabled={hasError}
                    >
                      {isAddUser ? "Add" : "Update"}
                    </ActionButton>
                  )}
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
      </FormModal>
      <NotificationSnackbar notification={notification} />
      <DeleteConfirmFlow
        open={Boolean(deleteTarget) || bulkDeleteOpen}
        entity="user"
        ids={deleteTarget ? [deleteTarget.id] : selectedUsers}
        name={
          deleteTarget
            ? [deleteTarget.firstName, deleteTarget.middleName]
                .filter(Boolean)
                .join(" ")
            : `${selectedUsers.length} selected item${
                selectedUsers.length === 1 ? "" : "s"
              }`
        }
        onClose={() => {
          setDeleteTarget(null);
          setBulkDeleteOpen(false);
        }}
        onConfirm={async () => {
          await deleteAPI(deleteTarget ? deleteTarget.id : selectedUsers);
          setDeleteTarget(null);
          setBulkDeleteOpen(false);
        }}
      />
    </Box>
  );
}

export default Index;
