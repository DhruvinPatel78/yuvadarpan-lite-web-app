import React, { useEffect, useState } from "react";
import CustomTable from "../../../Component/Common/customTable";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  Tooltip,
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
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomInput from "../../../Component/Common/customInput";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import ContainerPage from "../../../Component/Container";
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
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";

function Index() {
  const dispatch = useDispatch();
  const { loading, surname, region, samaj } = UseRedux();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { notification } = NotificationData();
  const [userInfoModel, setUserInfoModel] = useState(false);
  const [isAddUser, setIsAddUser] = useState(false);
  const [userList, setUserList] = useState(null);
  const [selectedLastName, setSelectedLastName] = useState(null);
  const [selectedRegionName, setSelectedRegionName] = useState(null);
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
  const [list, setList] = useState({
    region: [],
    lastName: [],
  });
  const [selectedRole, setSelectedRole] = useState([]);
  const [samajListByRegion, setSamajListByRegion] = useState(samaj);

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
      localSamaj: "",
      dob: "",
      gender: "",
      role: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        isAddUser
          ? await axios
              .post(`/user/add/`, { ...values, role: values.role.value })
              .then((res) => {
                userInfoModalClose();
                handleUserList();
              })
          : await axios
              .patch(`/user/update/${rest._id}`, {
                ...rest,
              })
              .then((res) => {
                userInfoModalClose();
                handleUserList();
              });
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(endLoading());
      }
      resetForm();
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

  const handleUserList = async (isRest = false) => {
    try {
      const text = selectedSearchByText
        ? {
            [selectedSearchBy.id]: isRest ? "" : selectedSearchByText,
          }
        : {};
      await axios
        .get(`/user/list?page=${page + 1}&limit=${rowsPerPage}`, {
          params: {
            lastName: isRest ? [] : filteredSurnameIds,
            roles: isRest ? [] : filteredRolesIds,
            region: isRest ? [] : filteredRegionIds,
            samaj: isRest ? [] : filteredSamajIds,
            ...text,
          },
        })
        .then((res) => {
          setUserList(res.data);
        });
    } catch (e) {
      console.error("Error fetching user list", e);
    }
  };

  useEffect(() => {
    handleUserList();
  }, [page, rowsPerPage]);

  const userInfoModalOpen = (userInfo) => {
    setUserInfoModel(true);
    setList((pre) => ({
      ...pre,
      lastName: surname.map((data) => ({
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
      await axios
        .patch(`/user/update/${userInfo?._id}`, {
          [field]: action,
        })
        .then((res) => {
          handleUserList();
        });
    } catch (e) {
      console.error("Update Error =>", e);
    }
  };

  const userInfoModalClose = () => {
    setUserInfoModel(false);
    setIsAddUser(false);
    setSelectedLastName(null);
    setSelectedRegionName(null);
    setSelectedSamajName(null);
    resetForm();
  };

  const getSamajList = async (regionId) => {
    try {
      await axios.get(`/samaj/listByRegion/${regionId}`).then((res) => {
        setSamajList(res.data);
      });
    } catch (e) {
      console.error("Error =>", e);
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
            onClick={(e) =>
              userActionHandler(record?.row, !record?.row?.allowed, "allowed")
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
          <CustomSwitch
            checked={record?.row?.active}
            onClick={(e) =>
              userActionHandler(record?.row, !record?.row?.active, "active")
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
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary"}
              onClick={() => userInfoModalOpen(record?.row)}
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => deleteAPI(record?.row?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const deleteAPI = async (id) => {
    try {
      await axios
        .delete(`/user/delete`, {
          data: {
            users: [id],
          },
        })
        .then(() => {
          handleUserList();
        });
    } catch (error) {
      console.error(error);
    }
  };

  const hasError = Object.keys(errors)?.length || 0;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={" flex-col justify-center flex items-start gap-4"}
      >
        <div className={"w-full justify-between flex items-center"}>
          <p className={"text-3xl font-bold"}>Users</p>
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
                onClick={() => {
                  setPage(0);
                  handleUserList();
                }}
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
        />
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
                        setFieldValue("lastName", lastName.id);
                        setSelectedLastName(lastName.name);
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
                          list={list.region}
                          label={"Region"}
                          placeholder={"Select Your Region"}
                          name={"region"}
                          value={selectedRegionName}
                          errors={
                            touched?.region && errors?.region && errors?.region
                          }
                          onChange={(e, region) => {
                            setFieldValue("region", region.id);
                            setSelectedRegionName(region.name);
                            getSamajList(region.id);
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
                          errors={
                            touched?.localSamaj &&
                            errors?.localSamaj &&
                            errors?.localSamaj
                          }
                          onChange={(e, localSamaj) => {
                            setFieldValue("localSamaj", localSamaj.id);
                            setSelectedSamajName(localSamaj.name);
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
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControl className={"w-full"}>
                        <CustomAutoComplete
                          list={rolesList(false)}
                          label={"User Role"}
                          placeholder={"Select Your User Role"}
                          name={"role"}
                          value={values?.role}
                          errors={touched?.role && errors?.role && errors?.role}
                          onChange={(e, role) => {
                            setFieldValue("role", role);
                          }}
                          onBlur={handleBlur}
                        />
                      </FormControl>
                    </Grid>
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
    </Box>
  );
}

export default Index;
