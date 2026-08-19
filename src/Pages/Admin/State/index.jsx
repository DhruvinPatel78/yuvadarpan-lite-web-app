import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContainerPage from "../../../Component/Container";
import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import CustomInput from "../../../Component/Common/customInput";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import ConfirmModal, {
  getDeleteDescription,
} from "../../../Component/Common/ConfirmModal";
import {
  getSelectedData,
  listHandler,
  useFilteredIds,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly, hideLocationRowActions, isCountryManager } from "../../../util/util";
import {
  getStateList,
  addState,
  updateState,
  deleteState,
} from "../../../util/stateApi";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, country, auth } = UseRedux();
  const countryManager = isCountryManager(auth?.user?.role);
  const [ownCountryList, setOwnCountryList] = useState(false);
  const canAct = countryManager
    ? ownCountryList
    : !isLocationMasterReadOnly(auth?.user?.role);
  const hideRowActions =
    (!countryManager && hideLocationRowActions(auth?.user?.role)) ||
    (countryManager && !ownCountryList);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [stateData, setStateData] = useState(null);
  const [stateModalData, setStateModalData] = useState(null);
  const [stateAddEditModel, setStateAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    handleStateList();
  }, [page, rowsPerPage, ownCountryList]);

  const stateListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "regionCount",
      headerName: "Regions",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => record?.row?.regionCount ?? 0,
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
          <CustomSwitch checked={record?.row?.active} disabled={!canAct} />
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
          <Tooltip title={"View"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() =>
                navigate(`/admin/state/${record?.row?.id}`, {
                  state: { ...record?.row, backTo: "/admin/state" },
                })
              }
            />
          </Tooltip>
          {canAct ? (
            <>
              <Tooltip title={"Edit"}>
                <ModeEditIcon
                  className={"text-primary cursor-pointer"}
                  onClick={() => {
                    setStateModalData(record?.row);
                    setStateAddEditModel(!stateAddEditModel);
                    setCountryList(
                      country.map((data) => ({
                        ...data,
                        label: data.name,
                        value: data.id,
                      }))
                    );
                    setFieldValue("name", record?.row.name);
                    setFieldValue("country_id", record?.row.country_id);
                    setSelectedCountry(
                      country.find((item) => item?.id === record?.row?.country_id)
                        ?.name
                    );
                  }}
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
  ].filter((column) => !hideRowActions || column.field !== "action");

  const formik = useFormik({
    initialValues: {
      country_id: "",
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        if (stateModalData) {
          await updateState(stateModalData.id, {
            ...rest,
            updatedAt: new Date(),
          });
        } else {
          await addState({ ...rest });
        }
        stateAddEditModalClose();
        handleStateList();
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

  const stateAddEditModalClose = () => {
    setStateAddEditModel(!stateAddEditModel);
    setStateModalData(null);
    setFieldValue("name", null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    try {
      await deleteState(Array.isArray(id) ? id : [id]);
      handleStateList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const hasError = Object.keys(errors)?.length || 0;
  const filteredCountryIds = useFilteredIds(selectedCountry, "value", "label");
  const handleStateList = async (isRest = false) => {
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
        country: isRest ? [] : filteredCountryIds,
        ...text,
      };
      if (countryManager) {
        params.ownCountry = ownCountryList;
      }
      const data = await getStateList(params);
      setStateData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedCountry([]);
    handleStateList(true);
  };

  const toggleCardSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <div className={"flex w-full items-center justify-between my-2"}>
          <p className={"text-3xl font-bold"}>State</p>
          <div className={"flex items-center gap-3"}>
            {countryManager ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={ownCountryList}
                    onChange={(e) => {
                      setOwnCountryList(e.target.checked);
                      setPage(0);
                    }}
                  />
                }
                label={
                  <span className={"font-semibold text-[#572a2a]"}>
                    Your State
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
                setStateAddEditModel(!stateAddEditModel);
                setCountryList(
                  country.map((data) => ({
                    ...data,
                    label: data.name,
                    value: data.id,
                  }))
                );
              }}
            >
              Add State
            </Button>
          ) : null}
          </div>
        </div>
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomAutoComplete
              list={listHandler(country)}
              multiple={true}
              label={"Country"}
              placeholder={"Select Your Country"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedCountry}
              name="country"
              onChange={(e, country) => {
                if (country) {
                  setSelectedCountry((pre) => getSelectedData(pre, country, e));
                }
              }}
            />
            <CustomInput
              type={"text"}
              placeholder={"Enter Search State"}
              name={"state"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => {
                setSelectedSearchByText(e.target.value);
                if (e.target.value === "") {
                  handleStateList(true);
                }
              }}
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
                onClick={() => handleStateList()}
              >
                Submit
              </button>
              {(selectedSearchByText || selectedCountry?.length > 0) && (
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
        <div className={"hidden md:block w-full"}>
        <CustomTable
          columns={stateListColumn}
          data={stateData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
          onDeleteSelected={canAct ? deleteAPI : undefined}
        />
        </div>
        <MasterMobileCards
          rows={stateData?.data || []}
          emptyText="No states"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canAct}
          getDetails={(row) => [`Regions: ${row.regionCount ?? 0}`]}
          activeDisabled={!canAct}
          onView={
            hideRowActions
              ? undefined
              : (row) =>
                  navigate(`/admin/state/${row.id}`, {
                    state: { ...row, backTo: "/admin/state" },
                  })
          }
          onEdit={
            canAct
              ? (row) => {
                  setStateModalData(row);
                  setStateAddEditModel(true);
                  setCountryList(
                    country.map((data) => ({
                      ...data,
                      label: data.name,
                      value: data.id,
                    }))
                  );
                  setFieldValue("name", row.name);
                  setFieldValue("country_id", row.country_id);
                  setSelectedCountry(
                    country.find((item) => item?.id === row?.country_id)?.name
                  );
                }
              : undefined
          }
          onDelete={canAct ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={stateData?.total || 0}
          onDeleteSelected={canAct ? deleteAPI : undefined}
        />
      </ContainerPage>
      {stateAddEditModel ? (
        <Modal
          open={stateAddEditModel}
          onClose={() => stateAddEditModalClose()}
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
              <span className={"text-2xl font-bold"}>State</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => stateAddEditModalClose()}
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
                    <FormControl className={"w-full flex  gap-4"}>
                      <CustomAutoComplete
                        list={countryList}
                        label={"Country"}
                        placeholder={"Select Your Country"}
                        name={"country_id"}
                        value={selectedCountry}
                        errors={
                          touched?.country && errors?.country && errors?.country
                        }
                        onSelect={handleChange}
                        onChange={(e, country) => {
                          setFieldValue("country_id", country.id);
                          setSelectedCountry(country.name);
                        }}
                        onBlur={handleBlur}
                      />
                      <CustomInput
                        name={"name"}
                        id="state"
                        label="State"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedCountry}
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
                        {stateModalData ? "UPDATE" : "ADD"}
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Paper>
        </Modal>
      ) : null}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete confirmation"
        description={getDeleteDescription(deleteTarget?.name)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deleteAPI(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
