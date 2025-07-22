import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import CustomInput from "../../../Component/Common/customInput";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import { UseRedux } from "../../../Component/useRedux";
import {
  getSurnameList,
  addSurname,
  updateSurname,
  deleteSurname,
} from "../../../util/surnameApi";

export default function Index() {
  const dispatch = useDispatch();
  const { loading } = UseRedux();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [surnameData, setSurnameData] = useState(null);
  const [surnameModalData, setSurnameModalData] = useState(null);
  const [surnameAddEditModel, setSurnameAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");

  useEffect(() => {
    handleSurnameList();
  }, [page, rowsPerPage]);

  const surnameListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
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
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => {
                setSurnameModalData(record?.row);
                setSurnameAddEditModel(!surnameAddEditModel);
                setFieldValue("name", record?.row.name);
                setFieldValue("gotra", record?.row.gotra);
                setFieldValue("mainBranch", record?.row.mainBranch);
              }}
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

  const userActionHandler = async (countryInfo, action, field) => {
    try {
      await updateSurname(countryInfo?.id, { ...countryInfo, [field]: action });
      handleSurnameList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      gotra: "",
      mainBranch: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        if (surnameModalData) {
          await updateSurname(surnameModalData.id, {
            ...rest,
            updatedAt: new Date(),
          });
        } else {
          await addSurname({ ...rest });
        }
        surnameAddEditModalClose();
        handleSurnameList();
      } catch (e) {
        // Optionally handle error with notification
      } finally {
        dispatch(endLoading());
      }
      resetForm();
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
    }),
  });
  const {
    errors,
    values,
    resetForm,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  } = formik;

  const surnameAddEditModalClose = () => {
    setSurnameAddEditModel(!surnameAddEditModel);
    setSurnameModalData(null);
    setFieldValue("name", null);
    setFieldValue("gotra", null);
    setFieldValue("mainBranch", null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    try {
      await deleteSurname([id]);
      handleSurnameList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const hasError = Object.keys(errors)?.length || 0;

  const handleSurnameList = async (isRest = false) => {
    try {
      const text =
        selectedSearchByText && !isRest
          ? {
              name: selectedSearchByText,
            }
          : {};
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...text,
      };
      const data = await getSurnameList(params);
      setSurnameData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    handleSurnameList(true);
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <div className={"flex w-full items-center justify-between my-2"}>
          <p className={"text-3xl font-bold"}>Surname</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => {
              setSurnameAddEditModel(!surnameAddEditModel);
            }}
          >
            Add Surname
          </Button>
        </div>
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomInput
              type={"text"}
              placeholder={"Enter Search Surname"}
              name={"name"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => setSelectedSearchByText(e.target.value)}
            />

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className={"flex justify-start items-center gap-4"}
            >
              <button
                className={"bg-primary text-white p-2 px-4 rounded font-bold"}
                onClick={() => handleSurnameList()}
              >
                Submit
              </button>
              {selectedSearchByText && (
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
          columns={surnameListColumn}
          data={surnameData}
          name={"surname"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"surnameList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
        />
      </ContainerPage>
      {surnameAddEditModel ? (
        <Modal
          open={surnameAddEditModel}
          onClose={() => surnameAddEditModalClose()}
          sx={{
            "& .MuiModal-backdrop": {
              backdropFilter: "blur(2px) !important",
              background: "#878b9499 !important",
            },
          }}
          className="flex justify-center items-center"
        >
          <Paper
            elevation={10}
            className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none"
          >
            <div className={"flex flex-row justify-between"}>
              <span className={"text-2xl font-bold"}>Surname</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => surnameAddEditModalClose()}
                />
              </Tooltip>
            </div>
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
                }
              >
                <Grid container className={"w-full pt-4"} spacing={2}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full gap-4"}>
                      <CustomInput
                        name={"name"}
                        id="surname"
                        label="Surname"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={touched?.name && errors?.name && errors?.name}
                      />
                      <CustomInput
                        name={"gotra"}
                        id="gotra"
                        label="Gotra"
                        value={values.gotra}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.gotra && errors?.gotra && errors?.gotra
                        }
                      />
                      <CustomInput
                        name={"mainBranch"}
                        id="mainBranch"
                        label="Main Branch"
                        value={values.mainBranch}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.mainBranch &&
                          errors?.mainBranch &&
                          errors?.mainBranch
                        }
                      />
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
                        {surnameModalData ? "UPDATE" : "ADD"}
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Paper>
        </Modal>
      ) : null}
    </Box>
  );
}
