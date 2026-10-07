import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Link, Typography } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import { AuthShell, Button } from "../../Component/UI";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { UseRedux } from "../../Component/useRedux";
import useAxios from "../../util/useAxios";
import moment from "moment";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CustomAutoComplete from "../../Component/Common/customAutoComplete";
import CustomRadio from "../../Component/Common/customRadio";
import { registerUser } from "../../util/authApi";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import getMessagingRegistration from "../../util/getMessagingRegistration";
import AdBanner from "../../Component/Common/AdBanner";
import { masterNameText } from "../../util/bhasha";

const FCM_WAIT_MS = 3500;

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const TODAY = moment().format("YYYY-MM-DD");

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  middleName: Yup.string().required("Required"),
  familyId: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  localSamaj: Yup.string().required("Required"),
  region: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  email: Yup.string()
    .matches(
      "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
      "Enter a valid email"
    )
    .required("Required"),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a 10-digit mobile")
    .required("Required"),
  password: Yup.string().required("Required"),
  confirmPassword: Yup.string().required("Required"),
  dob: Yup.date()
    .required("Required")
    .min(new Date("1950-01-01"), "Date cannot be before 1950")
    .max(new Date(), "Date cannot be in the future"),
});

const toOptionList = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map((data) => ({
    ...data,
    label: masterNameText(data) || data?.label || "",
    value: data?.id,
  }));

const optionId = (option) => {
  if (option == null || option === "") return "";
  if (typeof option !== "object") return String(option);
  return String(option.uuid || option.id || option.value || option._id || "");
};

function RegistrationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const [regionList, setRegionList] = useState([]);
  const [samajList, setSamajList] = useState([]);
  const [lastNameList, setLastNameList] = useState([]);
  const [selectedLastName, setSelectedLastName] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSamaj, setSelectedSamaj] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [surnameRes, regionRes] = await Promise.all([
          useAxios.get("/surname/get-all-list"),
          useAxios.get("/region/get-all-list"),
        ]);
        if (!active) return;
        setLastNameList(toOptionList(surnameRes?.data));
        setRegionList(toOptionList(regionRes?.data));
      } catch (e) {
        // Keep empty lists if masters fail to load
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const getSamajList = useCallback((regionId) => {
    if (!regionId) {
      setSamajList([]);
      return;
    }
    useAxios.get(`/samaj/listByRegion/${regionId}`).then((res) => {
      setSamajList(toOptionList(res?.data));
    });
  }, []);

  const getFcmToken = async () => {
    try {
      const tokenPromise = (async () =>
        getToken(messaging, {
          vapidKey:
            "BJL8nmbe31A9I8MuiulNUL8Ip-6ZL3rYihhIG7oA_4Q-WBZAU53BENLfw6y94Zz6m9YQQZgrXpeZ-BtXNy_R3i8",
          serviceWorkerRegistration: await getMessagingRegistration(),
        }))();
      return await Promise.race([
        tokenPromise,
        new Promise((resolve) => setTimeout(() => resolve(null), FCM_WAIT_MS)),
      ]);
    } catch (err) {
      console.error("FCM token error:", err);
    }
    return null;
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
      dob: "",
      region: "",
      localSamaj: "",
      gender: "male",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (value, { resetForm }) => {
      if (value.password !== value.confirmPassword) {
        setNotification({
          type: "error",
          message: "Passwords do not match.",
        });
        return;
      }
      dispatch(startLoading());
      try {
        const fcmToken = await getFcmToken();
        await registerUser({
          familyId: value?.familyId,
          firstName: value?.firstName,
          middleName: value?.middleName,
          lastName: value?.lastName,
          email: value?.email,
          mobile: value?.mobile,
          password: value?.password,
          dob: moment(value?.dob).format(),
          region: value?.region,
          localSamaj: value?.localSamaj,
          role: "USER",
          gender: value?.gender,
          language: "gu",
          fcmToken: fcmToken,
        });
        resetForm();
        setSelectedLastName(null);
        setSelectedRegion(null);
        setSelectedSamaj(null);
        setSamajList([]);
        dispatch(endLoading());
        navigate("/thankyou");
      } catch (e) {
        dispatch(endLoading());
        setNotification({
          type: "error",
          message: e?.response?.data?.message || "Registration failed.",
        });
      }
    },
  });

  const {
    isSubmitting,
    setFieldValue,
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
  } = formik;

  const fieldError = useCallback(
    (name) => (touched[name] && errors[name] ? errors[name] : ""),
    [touched, errors]
  );

  const digitsOnly = useCallback(
    (name, maxLen) => (event) => {
      const digits = String(event.target.value || "")
        .replace(/\D/g, "")
        .slice(0, maxLen);
      setFieldValue(name, digits, false);
    },
    [setFieldValue]
  );

  const regionOptions = useMemo(() => regionList, [regionList]);
  const samajOptions = useMemo(() => samajList, [samajList]);
  const surnameOptions = useMemo(() => lastNameList, [lastNameList]);

  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                className="text-center text-primary !font-semibold !text-[22px]"
                variant="h3"
              >
                Create an account
              </Typography>
              <p className="text-center text-sm text-mutedText mt-1.5">
                Join the Yuvadarpan directory
              </p>
            </Grid>
            <CustomInput
              type={"text"}
              xs={12}
              md={4}
              label={"First Name"}
              placeholder={"Enter Your First Name"}
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
              errors={fieldError("firstName")}
            />
            <CustomInput
              type={"text"}
              xs={12}
              md={4}
              label={"Middle Name"}
              placeholder={"Enter Your Middle Name"}
              name="middleName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.middleName}
              errors={fieldError("middleName")}
            />
            <CustomAutoComplete
              list={surnameOptions}
              label={"Last Name"}
              placeholder={"Select Your Last Name"}
              xs={12}
              md={4}
              name="lastName"
              onChange={(e, lastName) => {
                setFieldValue("lastName", optionId(lastName), false);
                setSelectedLastName(lastName || null);
              }}
              onBlur={handleBlur}
              errors={fieldError("lastName")}
              value={selectedLastName}
            />
            <CustomInput
              type={"text"}
              xs={12}
              md={6}
              label={"Email"}
              placeholder={"Enter Your Email"}
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              errors={fieldError("email")}
              value={values.email}
            />
            <CustomInput
              type={"tel"}
              xs={12}
              md={6}
              label={"Mobile"}
              placeholder={"Enter 10-digit mobile"}
              name="mobile"
              onChange={digitsOnly("mobile", 10)}
              onBlur={handleBlur}
              errors={fieldError("mobile")}
              value={values.mobile}
            />
            <CustomInput
              type={"password"}
              xs={12}
              md={6}
              label={"Password"}
              placeholder={"Create Your Password"}
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              errors={fieldError("password")}
              value={values.password}
            />
            <CustomInput
              type={"password"}
              xs={12}
              md={6}
              label={"Confirm Password"}
              placeholder={"Confirm your Password"}
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              errors={fieldError("confirmPassword")}
            />
            <CustomAutoComplete
              list={regionOptions}
              label={"Region"}
              placeholder={"Select Your Region"}
              name={"region"}
              xs={12}
              md={6}
              value={selectedRegion}
              errors={fieldError("region")}
              onChange={(e, region) => {
                const id = optionId(region);
                setFieldValue("region", id, false);
                setFieldValue("localSamaj", "", false);
                setSelectedRegion(region || null);
                setSelectedSamaj(null);
                getSamajList(id);
              }}
              onBlur={handleBlur}
            />
            <CustomAutoComplete
              list={samajOptions}
              label={"Local Samaj"}
              placeholder={"Select Your Samaj"}
              name={"localSamaj"}
              xs={12}
              md={6}
              value={selectedSamaj}
              errors={fieldError("localSamaj")}
              disabled={!selectedRegion}
              onChange={(e, localSamaj) => {
                setFieldValue("localSamaj", optionId(localSamaj), false);
                setSelectedSamaj(localSamaj || null);
              }}
              onBlur={handleBlur}
            />
            <CustomInput
              type={"text"}
              xs={12}
              sm={6}
              label={"Family ID"}
              placeholder={"Enter Your Family Id"}
              name="familyId"
              inputProps={{ inputMode: "numeric", maxLength: 10 }}
              onChange={digitsOnly("familyId", 10)}
              onBlur={handleBlur}
              errors={fieldError("familyId")}
              value={values.familyId}
            />
            <CustomInput
              type={"date"}
              xs={12}
              sm={6}
              label={"Date of birth"}
              placeholder={"Select Your DOB"}
              name="dob"
              onChange={handleChange}
              onBlur={handleBlur}
              errors={fieldError("dob")}
              value={values.dob}
              max={TODAY}
              min="1950-01-01"
            />
            <CustomRadio
              list={GENDER_OPTIONS}
              label={"Gender"}
              name={"gender"}
              xs={12}
              sm={6}
              value={values?.gender}
              errors={fieldError("gender")}
              className={"flex flex-row"}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                disabled={loading || isSubmitting}
                loading={loading || isSubmitting}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography className="flex justify-center flex-wrap text-sm text-mutedText">
                Already have an account?
                <Link
                  href={"/login"}
                  className="px-1 !text-primary !no-underline !font-semibold"
                >
                  Sign in
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} className="!pt-0">
              <Link
                href={"/register"}
                className="flex justify-center !text-xs !text-mutedText !no-underline"
              >
                Need help?
              </Link>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
      <NotificationSnackbar notification={notification} />
    </>
  );
}

/** Shell stays mounted so the ad banner does not re-render on every keystroke. */
export default function Index() {
  return (
    <AuthShell
      maxWidthClass="sm:max-w-[600px]"
      beforeCard={<AdBanner page="signup" />}
    >
      <RegistrationForm />
    </AuthShell>
  );
}
