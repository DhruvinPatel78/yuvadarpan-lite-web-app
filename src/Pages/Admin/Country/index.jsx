import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import axios from "../../../util/useAxios";
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
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";

const all = {
  label: "All",
  value: "all",
  name: "All",
  id: "",
};

export default function Index() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { surname, region } = useSelector((state) => state.location);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [countryData, setCountryData] = useState(null);
  const [countryModalData, setCountryModalData] = useState(null);
  const [countryAddEditModel, setCountryAddEditModel] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedNative, setSelectedNative] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    name: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");

  const getCountryList = async (isRest = false) => {
    const text = selectedSearchByText
      ? {
        [selectedSearchBy.id]: isRest ? "" : selectedSearchByText,
      }
      : {};
    axios
      .get(`/country/list?page=${page + 1}&limit=${rowsPerPage}`,{
        params: {
          ...text,
        }
      })
      .then((res) => {
        setCountryData(res.data);
      });
  };

  useEffect(() => {
    getCountryList(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const countryListColumn = [
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
          {/*<Tooltip title={"View"}>*/}
          {/*  <VisibilityIcon className={"text-primary cursor-pointer"} />*/}
          {/*</Tooltip>*/}
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => {
                setCountryModalData(record?.row);
                setCountryAddEditModel(!countryAddEditModel);
                setFieldValue("name", record?.row.name);
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

  const userActionHandler = (countryInfo, action, field) => {
    axios
      .patch(`/country/update/${countryInfo?.id}`, {
        ...countryInfo,
        [field]: action,
      })
      .then(() => {
        getCountryList();
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        countryModalData
          ? axios
              .patch(`/country/update/${countryModalData.id}`, {
                ...rest,
                updatedAt: new Date(),
              })
              .then((res) => {
                countryAddEditModalClose();
                getCountryList();
              })
          : axios
              .post(`/country/add`, {
                ...rest,
              })
              .then((res) => {
                countryAddEditModalClose();
                getCountryList();
              });
      } catch (e) {
        console.log("Error =>", e);
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
    setValues,
    resetForm,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  } = formik;

  const countryAddEditModalClose = () => {
    setCountryAddEditModel(!countryAddEditModel);
    setCountryModalData(null);
    setFieldValue("name", null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    axios
      .delete(`/country/delete`, {
        data: {
          countries: [id],
        },
      })
      .then(() => {
        getCountryList();
      });
  };

  const hasError = Object.keys(errors)?.length || 0;

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const setLabelValueInList = (data) => {
    return data.map((data) => ({
      ...data,
      label: data.name,
      value: data.id,
    }));
  };

  const handleRequestList = () => {
    const text = selectedSearchByText
      ? {
          [selectedSearchBy.id]: selectedSearchByText,
        }
      : {};
    axios
      .get(`/yuvaList/requests?page=${page + 1}&limit=${rowsPerPage}`, {
        params: {
          fullName: selectedSurname
            ?.filter((data) => data.name !== "All")
            ?.map((item) => item?.id),
          native: selectedNative
            ?.filter((data) => data.name !== "All")
            ?.map((item) => item?.id),
          ...text,
        },
      })
      .then((res) => {
        setCountryData(res?.data);
      });
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedSearchBy({
      label: "",
      id: "",
    });
    setSelectedSurname([]);
    setSelectedNative([]);
    handleRequestList(true);
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className={"flex-col justify-center flex items-start gap-3"}>
        <div className={"flex w-full items-center justify-between my-2"}>
          <p className={"text-3xl font-bold"}>Country</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => {
              setCountryAddEditModel(!countryAddEditModel);
            }}
          >
            Add Country
          </Button>
        </div>
        <Accordion
          className={"w-full rounded"}
          expanded={expanded}
          onChange={handleExpansion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={"text-primary"} />}
            aria-controls="panel1-content"
            id="panel1-header"
            className={"text-primary font-extrabold text-[18px]"}
          >
            Filter & Search
          </AccordionSummary>
          <AccordionDetails className={"p-4"}>
            <Grid spacing={2} container>
              <CustomAutoComplete
                list={[all, ...setLabelValueInList(surname)]}
                multiple={true}
                label={"Full Name"}
                placeholder={"Select Your Full Name"}
                xs={3}
                value={selectedSurname}
                name="fullname"
                onChange={(e, lastName) => {
                  if (lastName) {
                    setSelectedSurname((pre) =>
                      (lastName.map((item) => item.name).includes("All") &&
                        lastName?.length === 1) ||
                      (lastName.map((item) => item.name).includes("All") &&
                        lastName
                          .map((item) => item.name)
                          ?.findIndex((data) => data === "All") !== 0)
                        ? [all]
                        : [...lastName].filter((item) => item.name !== "All")
                    );
                  }
                }}
              />
              <CustomAutoComplete
                list={[all, ...setLabelValueInList(region)]}
                multiple={true}
                label={"Native"}
                placeholder={"Select Your Native"}
                xs={3}
                name="native"
                value={selectedNative}
                onChange={(e, native) => {
                  if (native) {
                    setSelectedNative((pre) =>
                      (native.map((item) => item.name).includes("All") &&
                        native?.length === 1) ||
                      (native.map((item) => item.name).includes("All") &&
                        native
                          .map((item) => item.name)
                          ?.findIndex((data) => data === "All") !== 0)
                        ? [all]
                        : [...native].filter((item) => item.name !== "All")
                    );
                  }
                }}
              />
              <CustomAutoComplete
                list={[
                  {
                    value: "familyId",
                    label: "Family Id",
                  },
                  {
                    value: "firmName",
                    label: "Firm Name",
                  },
                  {
                    value: "gender",
                    label: "Gender",
                  },
                ]}
                label={"Search By"}
                placeholder={"Select Your Search By"}
                xs={3}
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
                xs={3}
                value={selectedSearchByText}
                onChange={(e) => setSelectedSearchByText(e.target.value)}
              />

              <Grid
                item
                xs={12}
                className={"flex justify-center items-center gap-4"}
              >
                <button
                  className={"bg-primary text-white p-2 px-4 rounded font-bold"}
                  onClick={() => handleRequestList()}
                >
                  Submit
                </button>
                {(selectedSearchByText ||
                  selectedSearchBy.name ||
                  selectedNative?.length > 0 ||
                  selectedSurname?.length > 0) && (
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
          </AccordionDetails>
        </Accordion>
        <CustomTable
          columns={countryListColumn}
          data={countryData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"userList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
        />
      </ContainerPage>
      {countryAddEditModel ? (
        <Modal
          open={countryAddEditModel}
          onClose={() => countryAddEditModalClose()}
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
              <span className={"text-2xl font-bold"}>Country</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => countryAddEditModalClose()}
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
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"name"}
                        id="country"
                        label="Country"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={touched?.name && errors?.name && errors?.name}
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
                        {countryModalData ? "UPDATE" : "ADD"}
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
