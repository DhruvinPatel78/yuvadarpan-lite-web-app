import React, { useEffect, useState } from "react";
import CustomTable from "../../../Component/Common/customTable";
import {
  alpha,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../../Component/Header";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Form, FormikProvider, useFormik } from "formik";
import axios from "../../../util/useAxios";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const PrimarySwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#542b2b",
    "&:hover": {
      backgroundColor: alpha("#542b2b", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#542b2b",
  },
}));
function Index() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { notification, setNotification } = NotificationData();
  const [userInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, []);

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
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const { confirmPassword, ...rest } = values;
        axios
          .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${rest._id}`, {
            ...rest,
          })
          .then((res) => {
            setUserList(res?.data?.map((data) => ({ ...data, id: data?._id })));
            userInfoModalClose();
          });
      } catch (e) {
        console.log("Error =>", e);
      } finally {
        setLoading(false);
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
            // You can access the price field with `this.parent`.
            return value === values.password;
          },
        }),
      // team1: Yup.number()
      //   .min(1, "Team 1 is required")
      //   .required("Team 1 is required"),
      // team2: Yup.number()
      //   .min(1, "Team 2 is required")
      //   .required("Team 2 is required"),
      // startTime: Yup.string().required("Match start time is required"),
      // winner: Yup.number().max(32, `Invalid Team`),
    }),
  });

  useEffect(() => {
    handleUserList();
  }, []);

  const { errors, values, setValues, setFieldValue, resetForm } = formik;

  const userInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setValues({ ...userInfo, password: "" });
  };
  // const setUserData = (e) => {
  //   let name, value;
  //   name = e.target.name;
  //   value = e.target.value;
  //   setValues({ ...values, [name]: value });
  // };
  // const handleSubmit = () => {
  //   if (values.password === values.confirmpassword) {
  //     try {
  //       useAxios
  //         .post("/user/signUp", {
  //           familyId: values?.familyId,
  //           firstName: values?.firstName,
  //           middleName: values?.middleName,
  //           lastName: values?.lastName,
  //           email: values?.email,
  //           mobile: values?.mobile,
  //           password: values?.password,
  //           active: true,
  //           allowed: false,
  //           role: "USER",
  //         })
  //         .then((res) => {
  //           setValues(defaultValue);
  //           setNotification({ type: "success", message: "Success !" });
  //           navigate("/thankyou");
  //         });
  //     } catch (e) {
  //       setNotification({
  //         type: "error",
  //         message: e.response.data.message,
  //       });
  //     }
  //   } else {
  //     setNotification({
  //       type: "error",
  //       message: "confirm password not matched !",
  //     });
  //   }
  // };

  const userActionHandler = (userInfo, action, field) => {
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${userInfo._id}`, {
        ...userInfo,
        [field]: action,
      })
      .then((res) =>
        setUserList(res?.data?.map((data) => ({ ...data, id: data?._id }))),
      );
  };

  const userInfoModalClose = () => {
    setRequestInfoModel(false);
    resetForm();
  };
  const handleUserList = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/list`).then((res) => {
      setUserList(res.data.map((data) => ({ ...data, id: data?._id })));
    });
  };

  const fieldValueChangeHandler = (e) => {
    setFieldValue(e.target.name, e.target.value);
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
      field: "middleName",
      headerName: "Middle name",
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
          <PrimarySwitch
            checked={record.row.allowed}
            onClick={(e) =>
              userActionHandler(record.row, !record.row.allowed, "allowed")
            }
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
          <PrimarySwitch
            checked={record.row.active}
            onClick={(e) =>
              userActionHandler(record.row, !record.row.active, "active")
            }
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
          <ModeEditIcon
            className={"text-primary"}
            onClick={() => userInfoModalOpen(record.row)}
          />
        </div>
      ),
    },
  ];

  const hasError = Object.keys(errors).length;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div className={"p-4 pb-0 justify-between flex items-center"}>
        <p className={"text-3xl font-bold"}>Users</p>
      </div>
      <CustomTable
        columns={usersTableHeader}
        data={userList}
        name={"users"}
        pageSize={10}
        type={"userList"}
      />
      {userInfoModel ? (
        <Modal
          open={userInfoModel}
          // onClose={userInfoModalClose}
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
            <div className={"flex justify-between items-center"}>
              <Typography className={"font-bold text-2xl"}>
                Update User
              </Typography>
              <HighlightOffIcon
                onClick={userInfoModalClose}
                className={"cursor-pointer"}
              />
            </div>
            <FormikProvider value={formik}>
              <Form className={"gap-4 flex flex-col w-full"}>
                <Grid container className={"w-full pt-4 gap-y-4"}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"familyId"}
                        id="familyId"
                        label="Family ID"
                        value={values.familyId}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.familyId && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.familyId}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"firstName"}
                        id="firstName"
                        label="First Name"
                        value={values.firstName}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.firstName && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.firstName}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={"px-4"}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"middleName"}
                        id="middleName"
                        label="Middle Name"
                        value={values.middleName}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.middleName && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.middleName}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"lastName"}
                        id="lastName"
                        label="Last Name"
                        value={values.lastName}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.lastName && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.lastName}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} className={"pr-2"}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"email"}
                        id="email"
                        label="Email"
                        value={values.email}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.email && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.email}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} className={"pl-2"}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"mobile"}
                        id="mobile"
                        label="Mobile"
                        value={values.mobile}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.mobile && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.mobile}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} className={"pr-2"}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"password"}
                        id="password"
                        label="Password"
                        value={values.password}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.password && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.password}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} className={"pl-2"}>
                    <FormControl className={"w-full"}>
                      <TextField
                        name={"confirmPassword"}
                        id="confirmPassword"
                        label="Confirm Password"
                        value={values.confirmPassword}
                        variant="outlined"
                        onChange={fieldValueChangeHandler}
                      />
                      {errors.confirmPassword && (
                        <p className={"text-error text-sm transition-all"}>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
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
                        Update
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Paper>
        </Modal>
      ) : null}
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}

export default Index;
