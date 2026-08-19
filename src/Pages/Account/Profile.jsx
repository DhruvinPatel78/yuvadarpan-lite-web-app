import React, { useEffect } from "react";
import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import Header from "../../Component/Header";
import ContainerPage from "../../Component/Container";
import CustomInput from "../../Component/Common/customInput";
import CustomAutoComplete from "../../Component/Common/customAutoComplete";
import CustomRadio from "../../Component/Common/customRadio";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { UseRedux } from "../../Component/useRedux";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { getCurrentUser, updateUser } from "../../util/userApi";
import { persistUpdatedUser } from "./persistUser";

export default function Profile() {
  const dispatch = useDispatch();
  const { loading, auth, surname } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const user = auth?.user;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      dob: user?.dob || "",
      gender: user?.gender || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
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
        persistUpdatedUser(dispatch, user, { ...values, lastName });
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        persistUpdatedUser(dispatch, user, data);
      } catch (e) {
        // Keep persisted user if refresh fails
      }
    };
    loadUser();
  }, []);

  return (
    <Box>
      <Header />
      <ContainerPage className={"flex-col justify-center flex items-start gap-3"}>
        <p className={"text-3xl font-bold"}>Profile</p>
        <Paper elevation={3} className={"w-full p-6 rounded-2xl"}>
          <FormikProvider value={formik}>
            <Form>
              <Grid container spacing={2}>
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={6}
                  label={"First Name"}
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched.firstName && errors.firstName}
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={6}
                  label={"Middle Name"}
                  name="middleName"
                  value={values.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched.middleName && errors.middleName}
                />
                <CustomAutoComplete
                  list={surnameList}
                  label={"Last Name"}
                  placeholder={"Select Last Name"}
                  xs={12}
                  sm={6}
                  name="lastName"
                  value={lastNameValue}
                  errors={touched.lastName && errors.lastName}
                  onChange={(e, lastName) => {
                    setFieldValue("lastName", lastName?.value || lastName?.id || "");
                  }}
                />
                <CustomInput
                  type={"text"}
                  xs={12}
                  sm={6}
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
                  sm={6}
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
                  sm={6}
                  label={"DOB"}
                  name="dob"
                  value={values.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  focused
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
                  className={"flex flex-row"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Grid item xs={12} className={"flex justify-end"}>
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <button
                      className={`bg-[#572a2a] text-white px-6 py-3 rounded-lg font-bold ${
                        hasError ? "opacity-50" : "opacity-100"
                      }`}
                      type={"submit"}
                      disabled={hasError}
                    >
                      Save Profile
                    </button>
                  )}
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Paper>
      </ContainerPage>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
