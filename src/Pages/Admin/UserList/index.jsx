import React, { useEffect, useMemo, useRef, useState } from "react";
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
import OTPInput from "../../../Component/Common/OTPInput";
import DeleteIcon from "@mui/icons-material/Delete";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import moment from "moment";
import { PageHeader, FilterActions, MasterFilterBar, Button as ActionButton, AppModal, FormModal } from "../../../Component/UI";
import {
  getSelectedData,
  gotraOptionList,
  handleListById,
  filterFieldCols,
  lastNameIdsForGotraFilter,
  listHandler,
  requestFilterList,
  rolesList,
  surnamesForGotra,
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
import useAxios from "../../../util/useAxios";
import {
  sendOtp,
  verifyOtp,
  changePassword,
} from "../../../util/authApi";
import {
  getAllSurnameData,
  getAllRegionData,
  getAllSamajData,
  getAllCountryData,
} from "../../../util/getAPICall";
import { getGotraAllList } from "../../../util/gotraApi";

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

const toDateInputValue = (value) => {
  if (!value) return "";
  const isoDate = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

const comparableUserValues = (vals) => {
  const role =
    typeof vals?.role === "object" && vals?.role
      ? vals.role.value || vals.role.id || ""
      : vals?.role || "";
  return JSON.stringify({
    familyId: String(vals?.familyId || ""),
    firstName: String(vals?.firstName || ""),
    middleName: String(vals?.middleName || ""),
    lastName: String(vals?.lastName || ""),
    email: String(vals?.email || ""),
    mobile: String(vals?.mobile || ""),
    region: String(vals?.region || ""),
    localSamaj: String(vals?.localSamaj || ""),
    dob: toDateInputValue(vals?.dob),
    gender: String(vals?.gender || "").toLowerCase(),
    role: String(role),
  });
};

const sameId = (left, right) => {
  if (left == null || right == null || left === "" || right === "") return false;
  return String(left) === String(right);
};

const optionKeys = (item) =>
  [item?.id, item?._id, item?.value].filter((key) => key != null && key !== "");

const asOptions = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    label: item?.label || item?.name || "",
    name: item?.name || item?.label || "",
    value: item?.value || item?.id || item?._id,
    id: item?.id || item?._id || item?.value,
  }));

const findOption = (options, raw) => {
  if (raw == null || raw === "") return null;
  const keys =
    typeof raw === "object"
      ? optionKeys(raw)
      : [raw];
  return (
    (options || []).find((item) =>
      [...optionKeys(item), item?.label, item?.name].some((key) =>
        keys.some((match) => sameId(key, match))
      )
    ) || null
  );
};

function UserPasswordPanel({
  email,
  loading,
  onCancel,
  onSuccess,
  setNotification,
  dispatch,
}) {
  const [step, setStep] = useState("send");
  const [otp, setOtp] = useState("");
  const otpRef = useRef();

  const showError = (err, fallback) => {
    setNotification({
      message: err?.response?.data?.message || fallback,
      type: "error",
    });
  };

  const handleSendOtp = async () => {
    dispatch(startLoading());
    try {
      await sendOtp(email);
      setStep("otp");
      setOtp("");
      otpRef.current?.resetOtp();
      setNotification({
        message: "OTP sent to your email",
        type: "success",
      });
    } catch (err) {
      showError(err, "Failed to send OTP.");
    } finally {
      dispatch(endLoading());
    }
  };

  const handleVerifyOtp = async () => {
    dispatch(startLoading());
    try {
      await verifyOtp(email, otp);
      setStep("password");
      setNotification({
        message: "OTP verified",
        type: "success",
      });
    } catch (err) {
      showError(err, "OTP verification failed.");
      otpRef.current?.resetOtp();
      setOtp("");
    } finally {
      dispatch(endLoading());
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(startLoading());
      try {
        await changePassword(email, values.password);
        setNotification({
          message: "Password updated",
          type: "success",
        });
        resetForm();
        setStep("send");
        setOtp("");
        onSuccess?.();
      } catch (err) {
        showError(err, "Password update failed.");
      } finally {
        dispatch(endLoading());
      }
    },
  });

  const { errors, values, touched, handleChange, handleBlur, isSubmitting } =
    formik;
  const hasError = Object.keys(errors)?.length || 0;
  const stepCopy = {
    send: "Verify the email before choosing a new password.",
    otp: "Enter the code we sent to the email.",
    password: "Choose a new password for this account.",
  };

  return (
    <div className="w-full">
      <h2 className="text-base font-semibold text-primary">Change password</h2>
      <p className="text-sm text-mutedText mt-1 mb-5">{stepCopy[step]}</p>
      {step === "send" ? (
        <>
          <p className="text-sm text-gray-600 bg-muted rounded-lg px-3.5 py-3">
            Verification code will be sent to{" "}
            <span className="font-semibold text-primary break-all">
              {email || "the registered email"}
            </span>
          </p>
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-end gap-3 mt-5">
            <button
              type="button"
              className="inline-flex items-center justify-center text-sm font-semibold text-primary hover:underline underline-offset-4 min-h-[44px] md:min-h-0"
              onClick={onCancel}
            >
              Back
            </button>
            {loading ? (
              <CircularProgress color="secondary" size={28} />
            ) : (
              <ActionButton
                type="button"
                onClick={handleSendOtp}
                disabled={!email}
                className="max-md:w-full"
                icon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
              >
                Send OTP
              </ActionButton>
            )}
          </div>
        </>
      ) : null}
      {step === "otp" ? (
        <>
          <div className="flex items-start gap-2.5 bg-muted rounded-lg px-3.5 py-3">
            <CheckCircleOutlineIcon
              fontSize="small"
              className="text-primary mt-0.5 shrink-0"
            />
            <div className="text-sm min-w-0">
              <p className="font-semibold text-primary">OTP sent successfully</p>
              <p className="text-mutedText mt-0.5">
                Check{" "}
                <span className="font-medium text-primary break-all">{email}</span>{" "}
                for your 6-digit code.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <p className="font-semibold text-primary text-sm">
              Enter verification code
            </p>
            <p className="text-sm text-mutedText mt-0.5 mb-4">
              The code expires shortly for your security.
            </p>
            <OTPInput
              length={6}
              onComplete={(value) => setOtp(value)}
              ref={otpRef}
            />
          </div>
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-3 mt-6">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 min-h-[44px] md:min-h-0"
              onClick={handleSendOtp}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
              Resend code
            </button>
            {loading ? (
              <CircularProgress color="secondary" size={28} />
            ) : (
              <ActionButton
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp?.length !== 6}
                className="max-md:w-full"
                icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />}
              >
                Verify OTP
              </ActionButton>
            )}
          </div>
        </>
      ) : null}
      {step === "password" ? (
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2}>
              <CustomInput
                type={"password"}
                xs={12}
                label={"New password"}
                placeholder={"Create your password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.password && errors.password}
              />
              <CustomInput
                type={"password"}
                xs={12}
                label={"Confirm password"}
                placeholder={"Confirm your password"}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.confirmPassword && errors.confirmPassword}
              />
              <Grid
                item
                xs={12}
                className={"flex flex-col-reverse md:flex-row md:items-center justify-end gap-3"}
              >
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-sm font-semibold text-primary hover:underline underline-offset-4 min-h-[44px] md:min-h-0"
                  onClick={onCancel}
                >
                  Back
                </button>
                {loading ? (
                  <CircularProgress color="secondary" size={28} />
                ) : (
                  <ActionButton
                    type="submit"
                    disabled={hasError || isSubmitting}
                    className="max-md:w-full"
                  >
                    Change password
                  </ActionButton>
                )}
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      ) : null}
    </div>
  );
}

function Index() {
  const dispatch = useDispatch();
  const { loading, surname, region, samaj, country, auth } = UseRedux();
  const lastNameOptions = useMemo(() => asOptions(surname), [surname]);
  const regionOptions = useMemo(() => asOptions(region), [region]);
  const countryOptions = useMemo(() => asOptions(country), [country]);
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
  const [selectedCountryName, setSelectedCountryName] = useState(null);
  const [selectedStateName, setSelectedStateName] = useState(null);
  const [selectedRegionName, setSelectedRegionName] = useState(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [selectedGotra, setSelectedGotra] = useState([]);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    name: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [samajList, setSamajList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [samajListByRegion, setSamajListByRegion] = useState(samaj);
  const [gotraList, setGotraList] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [modalView, setModalView] = useState("form");
  const originalUserRef = useRef("");
  const today = moment().format("YYYY-MM-DD");

  const saveUserRecord = async (formValues) => {
    try {
      dispatch(startLoading());
      const {
        confirmPassword,
        password,
        role,
        country,
        state,
        district,
        city,
        ...rest
      } = formValues;
      const roleValue =
        isSamajManager ||
        isCityManager ||
        isDistrictManager ||
        isRegionManager ||
        isStateManager ||
        isCountryManager
          ? "USER"
          : role?.value ||
            role?.id ||
            (typeof role === "string" ? role : "") ||
            "USER";
      const payload = {
        ...rest,
        role: roleValue,
        dob: formValues.dob ? moment(formValues.dob).format() : formValues.dob,
        gender: String(formValues.gender || "").toLowerCase(),
      };
      if (isAddUser) {
        await addUser({ ...payload, password });
      } else {
        delete payload.password;
        await updateUser(payload.id, payload);
      }
      return true;
    } catch (e) {
      setNotification({
        type: "error",
        message: e?.response?.data?.message || "Failed to save user.",
      });
      return false;
    } finally {
      dispatch(endLoading());
    }
  };

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
    onSubmit: async (formValues, { resetForm }) => {
      const saved = await saveUserRecord(formValues);
      if (saved) {
        userInfoModalClose();
        handleUserList();
        resetForm();
      }
    },
    validationSchema: Yup.lazy(() =>
      Yup.object({
        firstName: Yup.string().required("Required"),
        middleName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        familyId: Yup.number()
          .typeError("Enter a number")
          .positive()
          .required("Required"),
        mobile: Yup.string()
          .matches(/^[6-9]\d{9}$/, "Enter a 10-digit mobile")
          .required("Required"),
        email: Yup.string().email("Enter a valid email").required("Required"),
        region: Yup.string().required("Required"),
        localSamaj: Yup.string().required("Required"),
        gender: Yup.string().required("Required"),
        dob: Yup.date()
          .required("Required")
          .min(new Date("1950-01-01"), "Date cannot be before 1950")
          .max(new Date(), "Date cannot be in the future"),
        password: isAddUser
          ? Yup.string().required("Required")
          : Yup.string(),
        confirmPassword: isAddUser
          ? Yup.string()
              .required("Required")
              .oneOf([Yup.ref("password")], "Passwords do not match")
          : Yup.string(),
      })
    ),
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
    validateForm,
    setTouched,
  } = formik;

  const samajOptions = useMemo(() => {
    const loaded = asOptions(samajList);
    if (loaded.length) return loaded;
    const regionId = values?.region;
    if (!regionId) return [];
    const regionDoc = findOption(regionOptions, regionId);
    const regionKeys = optionKeys(regionDoc).concat(regionId);
    return asOptions(samaj).filter((item) =>
      regionKeys.some(
        (key) => sameId(item.region_id, key) || sameId(item.region, key)
      )
    );
  }, [samajList, samaj, values?.region, regionOptions]);

  const selectedLastNameOption = findOption(lastNameOptions, values?.lastName);
  const selectedRegionOption = findOption(regionOptions, values?.region);
  const selectedSamajOption = findOption(samajOptions, values?.localSamaj);

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const gotraOptions = useMemo(() => gotraOptionList(gotraList), [gotraList]);
  const surnameFilterList = useMemo(
    () => listHandler(surnamesForGotra(surname, selectedGotra)),
    [surname, selectedGotra]
  );
  const filteredRegionIds = useFilteredIds(selectedRegion, "id");
  const filteredRolesIds = useFilteredIds(selectedRole, "id");
  const filteredSamajIds = useFilteredIds(selectedSamaj, "id");
  const filterCols = filterFieldCols(3);

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
        lastName: isRest
          ? []
          : lastNameIdsForGotraFilter(
              surname,
              selectedGotra,
              filteredSurnameIds
            ),
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
    if (!surname?.length) dispatch(getAllSurnameData);
    if (!region?.length) dispatch(getAllRegionData);
    if (!samaj?.length) dispatch(getAllSamajData);
    if (!country?.length) dispatch(getAllCountryData);
    getGotraAllList()
      .then((data) => setGotraList(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setGotraList([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setModalView("form");
    if (isAddUser === false && userInfo) {
      const roleOption =
        rolesList(false).find(
          (item) =>
            item?.value === userInfo?.role ||
            item?.id === userInfo?.role ||
            item?.name === userInfo?.role
        ) || userInfo?.role || "";
      const nextValues = {
        familyId: userInfo?.familyId || "",
        firstName: userInfo?.firstName || "",
        middleName: userInfo?.middleName || "",
        lastName: userInfo?.lastName || "",
        mobile: String(userInfo?.mobile || ""),
        email: userInfo?.email || "",
        password: "",
        confirmPassword: "",
        active: userInfo?.active,
        allowed: userInfo?.allowed,
        region: userInfo?.region || "",
        country: userInfo?.country || "",
        state: userInfo?.state || "",
        district: userInfo?.district || "",
        city: userInfo?.city || "",
        localSamaj: userInfo?.localSamaj || "",
        dob: toDateInputValue(userInfo?.dob),
        gender: String(userInfo?.gender || "").toLowerCase(),
        role: roleOption,
        id: userInfo?.id,
      };
      setValues((pre) => ({
        ...pre,
        ...nextValues,
      }));
      originalUserRef.current = comparableUserValues(nextValues);
      const regionOption = findOption(regionOptions, userInfo?.region);
      setSelectedRegionName(regionOption);
      if (userInfo?.region) {
        getSamajListByRegion(userInfo.region, regionOption);
      }
    } else {
      originalUserRef.current = "";
    }
  };

  const userActionHandler = async (userInfo, action, field) => {
    const previous = userInfo?.[field];
    setUserList((prev) => ({
      ...prev,
      data: (prev?.data || []).map((item) =>
        item.id === userInfo.id ? { ...item, [field]: action } : item
      ),
    }));
    try {
      await updateUser(userInfo?.id, { [field]: action });
    } catch (e) {
      setUserList((prev) => ({
        ...prev,
        data: (prev?.data || []).map((item) =>
          item.id === userInfo.id ? { ...item, [field]: previous } : item
        ),
      }));
      setNotification({
        type: "error",
        message: e?.response?.data?.message || "Failed to update user.",
      });
    }
  };

  const userInfoModalClose = () => {
    setUserInfoModel(false);
    setIsAddUser(false);
    setModalView("form");
    originalUserRef.current = "";
    setSelectedCountryName(null);
    setSelectedStateName(null);
    setSelectedRegionName(null);
    setSelectedDistrictName(null);
    setSelectedCityName(null);
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

  const getSamajListByRegion = async (regionId, regionOption) => {
    const regionDoc = regionOption || findOption(regionOptions, regionId);
    const regionKeys = optionKeys(regionDoc).concat(regionId).filter(Boolean);
    const localMatches = asOptions(samaj).filter((item) =>
      regionKeys.some(
        (key) => sameId(item.region_id, key) || sameId(item.region, key)
      )
    );
    if (localMatches.length) {
      setSamajList(localMatches);
    }
    try {
      const response = await useAxios.get(`/samaj/listByRegion/${regionId}`);
      const fetched = asOptions(response?.data || []);
      setSamajList(fetched.length ? fetched : localMatches);
    } catch (e) {
      if (!localMatches.length) {
        setSamajList([]);
      }
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
    setSelectedGotra([]);
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
            checked={Boolean(record?.row?.allowed)}
            disabled={!canAct}
            onChange={(event, checked) => {
              if (!canAct) return;
              userActionHandler(record?.row, checked, "allowed");
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
            checked={Boolean(record?.row?.active)}
            disabled={!canAct}
            onChange={(event, checked) => {
              if (!canAct) return;
              userActionHandler(record?.row, checked, "active");
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
  const hasUnsavedUserChanges =
    !isAddUser &&
    Boolean(originalUserRef.current) &&
    comparableUserValues(values) !== originalUserRef.current;

  const handleChangePasswordClick = async () => {
    if (hasUnsavedUserChanges) {
      const formErrors = await validateForm();
      if (Object.keys(formErrors || {}).length) {
        setTouched(
          Object.keys(formErrors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
          true
        );
        return;
      }
      const saved = await saveUserRecord(values);
      if (!saved) {
        return;
      }
      originalUserRef.current = comparableUserValues(values);
      setNotification({ type: "success", message: "Updated." });
      handleUserList();
    }
    setModalView("password");
  };

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
        <MasterFilterBar
          searchPlaceholder="Search"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => {
            setSelectedSearchByText(e.target.value);
            if (e.target.value === "") {
              handleUserList(true);
            }
          }}
          searchDisabled={!selectedSearchBy.id}
          filterCount={
            Number(Boolean(selectedSearchByText.trim())) +
            Number(Boolean(selectedSearchBy.id)) +
            Number(Boolean(selectedGotra?.length > 0)) +
            Number(Boolean(selectedSurname?.length > 0)) +
            Number(Boolean(selectedRegion?.length > 0)) +
            Number(Boolean(selectedSamaj?.length > 0)) +
            Number(Boolean(selectedRole?.length > 0))
          }
          isFilterOpen={isFilterOpen}
          onFilterClick={() => setIsFilterOpen((open) => !open)}
          extraFilters={
            <Grid spacing={2} container>
              <CustomAutoComplete
                list={gotraOptions}
                multiple={true}
                label={"Gotra"}
                placeholder={"Select Your Gotra"}
                {...filterCols}
                value={selectedGotra}
                name="gotra"
                onChange={(e, gotra) => {
                  if (gotra) {
                    setSelectedGotra((pre) => getSelectedData(pre, gotra, e));
                    setSelectedSurname([]);
                  }
                }}
              />
              <CustomAutoComplete
                list={surnameFilterList}
                multiple={true}
                label={"Surname"}
                placeholder={"Select Your Last Name"}
                {...filterCols}
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
                {...filterCols}
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
                {...filterCols}
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
                {...filterCols}
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
                {...filterCols}
                name="search"
                value={selectedSearchBy.name}
                onChange={(e, search) => {
                  setSelectedSearchBy({
                    name: search.label,
                    id: search.value,
                  });
                }}
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
                      selectedGotra?.length > 0 ||
                      selectedRegion?.length > 0 ||
                      selectedSurname?.length > 0 ||
                      selectedSamaj?.length > 0 ||
                      selectedRole?.length > 0
                  )}
                />
              </Grid>
            </Grid>
          }
        />
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
        <div className={"hidden md:block w-full min-w-0"}>
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
                  className={"rounded-xl overflow-hidden !border-2 !border-solid !border-[#d7d0c8]"}
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
                          checked={Boolean(row.allowed)}
                          disabled={!canAct}
                          onChange={(event, checked) => {
                            if (!canAct) return;
                            userActionHandler(row, checked, "allowed");
                          }}
                        />
                      </div>
                      <div className={"flex items-center gap-1"}>
                        <span className={"text-sm text-gray-600"}>Active</span>
                        <CustomSwitch
                          checked={Boolean(row.active)}
                          disabled={!canAct}
                          onChange={(event, checked) => {
                            if (!canAct) return;
                            userActionHandler(row, checked, "active");
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
        title={
          modalView === "password"
            ? "Change password"
            : `${isAddUser ? "New" : "Update"} User`
        }
        maxWidth="980px"
      >
        {modalView === "password" ? (
          <UserPasswordPanel
            email={values?.email}
            loading={loading}
            dispatch={dispatch}
            setNotification={setNotification}
            onCancel={() => setModalView("form")}
            onSuccess={() => {
              userInfoModalClose();
              handleUserList();
            }}
          />
        ) : (
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
                      list={lastNameOptions}
                      label={"Last Name"}
                      placeholder={"Select Your Last Name"}
                      name="lastName"
                      value={selectedLastNameOption}
                      errors={
                        touched.lastName && errors.lastName && errors.lastName
                      }
                      onChange={(e, lastName) => {
                        setFieldValue("lastName", lastName?.id || lastName?.value || "");
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
                      onChange={(event) => {
                        const digits = String(event.target.value || "")
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setFieldValue("mobile", digits);
                      }}
                      onBlur={handleBlur}
                      errors={
                        touched?.mobile && errors?.mobile && errors?.mobile
                      }
                    />
                  </FormControl>
                </Grid>
                {isAddUser ? (
                  <>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControl className={"w-full"}>
                        <CustomInput
                          type={"password"}
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
                          type={"password"}
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
                    <Grid item xs={12}>
                      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-mutedText">
                        Location
                      </p>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={countryOptions}
                          label={"Country"}
                          placeholder={"Select Your Country"}
                          name={"country"}
                          value={findOption(countryOptions, values?.country) || selectedCountryName}
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
                          list={asOptions(stateList)}
                          label={"State"}
                          placeholder={"Select Your State"}
                          name={"state"}
                          value={findOption(asOptions(stateList), values?.state)}
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
                          list={asOptions(regionList)}
                          label={"Region"}
                          placeholder={"Select Your Region"}
                          name={"region"}
                          value={findOption(asOptions(regionList), values?.region)}
                          disabled={!selectedStateName}
                          errors={
                            touched?.region && errors?.region && errors?.region
                          }
                          onChange={(e, regionValue) => {
                            setFieldValue("region", regionValue?.id);
                            setFieldValue("district", "");
                            setFieldValue("city", "");
                            setFieldValue("localSamaj", "");
                            setSelectedRegionName(regionValue?.name);
                            setSelectedDistrictName(null);
                            setSelectedCityName(null);
                            setCityList([]);
                            setSamajList([]);
                            if (regionValue?.id) getDistrictList(regionValue.id);
                            else setDistrictList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={asOptions(districtList)}
                          label={"District"}
                          placeholder={"Select Your District"}
                          name={"district"}
                          value={findOption(asOptions(districtList), values?.district)}
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
                          list={asOptions(cityList)}
                          label={"City"}
                          placeholder={"Select Your City"}
                          name={"city"}
                          value={findOption(asOptions(cityList), values?.city)}
                          disabled={!selectedDistrictName}
                          errors={
                            touched?.city && errors?.city && errors?.city
                          }
                          onChange={(e, city) => {
                            setFieldValue("city", city?.id);
                            setFieldValue("localSamaj", "");
                            setSelectedCityName(city?.name);
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
                          list={asOptions(samajList)}
                          label={"Local Samaj"}
                          placeholder={"Select Your Samaj"}
                          name={"localSamaj"}
                          value={findOption(asOptions(samajList), values?.localSamaj)}
                          disabled={!selectedCityName}
                          errors={
                            touched?.localSamaj &&
                            errors?.localSamaj &&
                            errors?.localSamaj
                          }
                          onChange={(e, localSamaj) => {
                            setFieldValue("localSamaj", localSamaj?.id);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-mutedText">
                        Location
                      </p>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={regionOptions}
                          label={"Region"}
                          placeholder={"Select Your Region"}
                          name={"region"}
                          value={selectedRegionOption}
                          errors={
                            touched?.region && errors?.region && errors?.region
                          }
                          onChange={(e, regionValue) => {
                            setFieldValue("region", regionValue?.id || regionValue?.value || "");
                            setFieldValue("localSamaj", "");
                            setSelectedRegionName(regionValue || null);
                            if (regionValue?.id || regionValue?.value) {
                              getSamajListByRegion(
                                regionValue.id || regionValue.value,
                                regionValue
                              );
                            } else setSamajList([]);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={samajOptions}
                          label={"Local Samaj"}
                          placeholder={"Select Your Samaj"}
                          name={"localSamaj"}
                          value={selectedSamajOption}
                          disabled={!values?.region}
                          errors={
                            touched?.localSamaj &&
                            errors?.localSamaj &&
                            errors?.localSamaj
                          }
                          onChange={(e, localSamaj) => {
                            setFieldValue(
                              "localSamaj",
                              localSamaj?.id || localSamaj?.value || ""
                            );
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
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
                      max={today}
                      min="1950-01-01"
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
                <Grid
                  item
                  xs={12}
                  className={"flex flex-col-reverse md:flex-row justify-end items-stretch md:items-center gap-2 !pt-2"}
                >
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <>
                      {isAddUser ? null : (
                        <ActionButton
                          type="button"
                          variant="secondary"
                          className="max-md:w-full"
                          onClick={handleChangePasswordClick}
                        >
                          Change password
                        </ActionButton>
                      )}
                      <ActionButton
                        type={"submit"}
                        disabled={hasError}
                        className="max-md:w-full"
                      >
                        {isAddUser ? "Add" : "Update"}
                      </ActionButton>
                    </>
                  )}
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        )}
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
