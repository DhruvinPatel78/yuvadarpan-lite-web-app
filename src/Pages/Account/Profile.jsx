import React, { useEffect, useMemo } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import Header from "../../Component/Header";
import ContainerPage from "../../Component/Container";
import CustomInput from "../../Component/Common/customInput";
import CustomAutoComplete from "../../Component/Common/customAutoComplete";
import CustomRadio from "../../Component/Common/customRadio";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { UseRedux } from "../../Component/useRedux";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { getCurrentUser, updateUser } from "../../util/userApi";
import { persistUpdatedUser } from "./persistUser";
import { PageHeader, Card, Button } from "../../Component/UI";
import { languageLabel, userLanguage } from "../../util/bhasha";
import {
  masterKeys,
  masterLabelOf,
  pickMasterId,
} from "../../Component/constant";
import {
  getAllCityData,
  getAllCountryData,
  getAllDistrictData,
  getAllRegionData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
} from "../../util/getAPICall";

const toDateInputValue = (value) => {
  if (!value) return "";
  const isoDate = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return isoDate ? isoDate[1] : "";
};

const lookupName = (list, id, lang = "en") =>
  masterLabelOf(list, id, lang) || "-";

const findMasterRow = (list, id) => {
  if (id == null || id === "") return null;
  const key = String(id);
  return (Array.isArray(list) ? list : []).find((row) =>
    masterKeys(row).includes(key)
  );
};

const formatUserDate = (value) => {
  if (!value) return "-";
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY hh:mm A") : String(value);
};

export default function Profile() {
  const dispatch = useDispatch();
  const {
    loading,
    auth,
    surname,
    country,
    state,
    region,
    district,
    city,
    samaj,
  } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const user = auth?.user;
  const lang = userLanguage(user);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      dob: toDateInputValue(user?.dob),
      gender: user?.gender || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Enter a valid email").required("Required"),
      mobile: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      dispatch(startLoading());
      try {
        const lastName =
          typeof values.lastName === "object"
            ? values.lastName.value || values.lastName.id
            : values.lastName;
        await updateUser(user.id, { ...values, lastName });
        const refreshed = await getCurrentUser().catch(() => null);
        persistUpdatedUser(
          dispatch,
          user,
          refreshed || { ...values, lastName }
        );
        setNotification({ message: "Profile updated", type: "success" });
      } catch (err) {
        setNotification({
          message: err?.response?.data?.message || "Profile update failed.",
          type: "error",
        });
      } finally {
        dispatch(endLoading());
      }
    },
  });

  const { errors, values, touched, handleChange, handleBlur, setFieldValue } =
    formik;
  const hasError = Object.keys(errors)?.length || 0;
  const surnameList = (surname || []).map((item) => ({
    ...item,
    label: item.name,
    value: item.id,
  }));
  const lastNameValue =
    surnameList.find(
      (item) => item.value === values.lastName || item.id === values.lastName
    ) || null;

  const locationIds = useMemo(() => {
    const samajRow =
      findMasterRow(samaj, user?.localSamaj) ||
      findMasterRow(samaj, user?.samaj);
    return {
      country: user?.country || samajRow?.country_id || "",
      state: user?.state || samajRow?.state_id || "",
      region: user?.region || samajRow?.region_id || "",
      district: user?.district || samajRow?.district_id || "",
      city: user?.city || samajRow?.city_id || "",
      localSamaj:
        user?.localSamaj || pickMasterId(samajRow) || "",
    };
  }, [user, samaj]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await Promise.all([
        dispatch(getAllSurnameData),
        dispatch(getAllCountryData),
        dispatch(getAllStateData),
        dispatch(getAllRegionData),
        dispatch(getAllDistrictData),
        dispatch(getAllCityData),
        dispatch(getAllSamajData),
      ]);
      try {
        const data = await getCurrentUser();
        if (cancelled) return;
        let stored = {};
        try {
          stored = JSON.parse(localStorage.getItem("user") || "{}") || {};
        } catch (e) {
          stored = {};
        }
        persistUpdatedUser(
          dispatch,
          {
            ...stored,
            token: stored?.token || localStorage.getItem("token"),
          },
          data
        );
      } catch (e) {
        // Keep persisted user if refresh fails
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <Box>
      <Header />
      <ContainerPage
        className={"flex-col justify-center flex items-start pb-6"}
      >
        <PageHeader
          title="My profile"
          description="Keep your personal details accurate and up to date."
        />
        <Card className="w-full">
          <h2 className="text-base font-semibold text-primary mb-5">
            Personal information
          </h2>
          <FormikProvider value={formik}>
            <Form>
              <Grid container spacing={2.5}>
                <CustomInput
                    type={"text"}
                    xs={12}
                    sm={4}
                    label={"Family ID"}
                    name="familyId"
                    value={user?.familyId || "-"}
                    readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"First name"}
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched.firstName && errors.firstName}
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Middle name"}
                  name="middleName"
                  value={values.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched.middleName && errors.middleName}
                />
                <CustomAutoComplete
                  list={surnameList}
                  label={"Last name"}
                  placeholder={"Select last name"}
                  xs={12}
                  sm={4}
                  name="lastName"
                  value={lastNameValue}
                  errors={touched.lastName && errors.lastName}
                  onChange={(e, lastName) => {
                    setFieldValue(
                      "lastName",
                      lastName?.value || lastName?.id || ""
                    );
                  }}
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Email"}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched.email && errors.email}
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Mobile"}
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched.mobile && errors.mobile}
                />
                <CustomInput
                  type={"date"}
                  xs={12}
                  sm={4}
                  label={"Date of birth"}
                  name="dob"
                  value={values.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <CustomRadio
                  list={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  label={"Gender"}
                  name={"gender"}
                  value={values.gender}
                  xs={12}
                  sm={4}
                  className={"flex flex-row"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />


                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Language"}
                  name="language"
                  value={languageLabel(user?.language) || "-"}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Country"}
                  name="country"
                  value={lookupName(country, locationIds.country, lang)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"State"}
                  name="state"
                  value={lookupName(state, locationIds.state, lang)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Region"}
                  name="region"
                  value={lookupName(region, locationIds.region, lang)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"District"}
                  name="district"
                  value={lookupName(district, locationIds.district, lang)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"City"}
                  name="city"
                  value={lookupName(city, locationIds.city, lang)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Local samaj"}
                  name="localSamaj"
                  value={lookupName(samaj, locationIds.localSamaj, lang)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={2}
                  label={"Allowed"}
                  name="allowed"
                  value={user?.allowed ? "Yes" : "No"}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={2}
                  label={"Active"}
                  name="active"
                  value={user?.active ? "Yes" : "No"}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Created at"}
                  name="createdAt"
                  value={formatUserDate(user?.createdAt)}
                  readOnly
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={4}
                  label={"Updated at"}
                  name="updatedAt"
                  value={formatUserDate(user?.updatedAt)}
                  readOnly
                />

                <Grid
                  item
                  xs={12}
                  className={"flex justify-end max-md:[&>button]:w-full pt-2"}
                >
                  {loading ? (
                    <CircularProgress color="secondary" size={28} />
                  ) : (
                    <Button type="submit" disabled={hasError}>
                      Save profile
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Card>
      </ContainerPage>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
