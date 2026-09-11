import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  FormControl,
  Grid,
  Tooltip,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import CustomInput from "../../../Component/Common/customInput";
import { Button as ActionButton, FormModal, PageHeader, FilterActions } from "../../../Component/UI";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly, hideLocationRowActions } from "../../../util/util";
import {
  getCountryList,
  addCountry,
  updateCountry,
  deleteCountry,
} from "../../../util/countryApi";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, auth } = UseRedux();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const hideRowActions = hideLocationRowActions(auth?.user?.role);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [countryData, setCountryData] = useState(null);
  const [countryModalData, setCountryModalData] = useState(null);
  const [countryAddEditModel, setCountryAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    handleCountryList();
  }, [page, rowsPerPage]);

  const countryListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "stateCount",
      headerName: "States",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => record?.row?.stateCount ?? 0,
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
            disabled={!canManage}
            onClick={() => {
              if (!canManage) return;
              userActionHandler(record?.row, !record?.row?.active, "active");
            }}
          />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"View"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() =>
                navigate(`/admin/country/${record?.row?.id}`, {
                  state: { ...record?.row, backTo: "/admin/country" },
                })
              }
            />
          </Tooltip>
          {canManage ? (
            <>
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
                  onClick={() => setDeleteTarget(record?.row)}
                />
              </Tooltip>
            </>
          ) : null}
        </div>
      ),
    },
  ].filter((column) => !hideRowActions || column.field !== "action");

  const userActionHandler = async (countryInfo, action, field) => {
    try {
      await updateCountry(countryInfo?.id, { ...countryInfo, [field]: action });
      handleCountryList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        if (countryModalData) {
          await updateCountry(countryModalData.id, {
            ...rest,
            updatedAt: new Date(),
          });
        } else {
          await addCountry({ ...rest });
        }
        countryAddEditModalClose();
        handleCountryList();
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

  const countryAddEditModalClose = () => {
    setCountryAddEditModel(!countryAddEditModel);
    setCountryModalData(null);
    setFieldValue("name", null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    try {
      await deleteCountry(Array.isArray(id) ? id : [id]);
      handleCountryList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const hasError = Object.keys(errors)?.length || 0;

  const handleCountryList = async (isRest = false) => {
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
      const data = await getCountryList(params);
      setCountryData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    handleCountryList(true);
  };

  const toggleCardSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const rows = countryData?.data || [];

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <PageHeader
          className="w-full"
          title="Country"
          actions={
            canManage ? (
              <ActionButton
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setCountryAddEditModel(!countryAddEditModel);
                }}
              >
                Add Country
              </ActionButton>
            ) : null
          }
        />
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomInput
              type={"text"}
              placeholder={"Enter Search Country Name"}
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
              className={"flex justify-start items-center"}
            >
              <FilterActions
                onSubmit={() => handleCountryList()}
                onReset={handleReset}
                showReset={Boolean(selectedSearchByText)}
              />
            </Grid>
          </Grid>
        </CustomAccordion>
        <div className={"hidden md:block w-full"}>
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
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="country"
        />
        </div>
        <MasterMobileCards
          rows={rows}
          emptyText="No countries"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canManage}
          getDetails={(row) => [`States: ${row.stateCount ?? 0}`]}
          activeDisabled={!canManage}
          onActiveChange={(row, next) =>
            userActionHandler(row, next, "active")
          }
          onView={
            hideRowActions
              ? undefined
              : (row) =>
                  navigate(`/admin/country/${row.id}`, {
                    state: { ...row, backTo: "/admin/country" },
                  })
          }
          onEdit={
            canManage
              ? (row) => {
                  setCountryModalData(row);
                  setCountryAddEditModel(true);
                  setFieldValue("name", row.name);
                }
              : undefined
          }
          onDelete={canManage ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={countryData?.total || 0}
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="country"
        />
      </ContainerPage>
      {countryAddEditModel ? (
        <FormModal
          open={countryAddEditModel}
          onClose={() => countryAddEditModalClose()}
          title="Country"
        >
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
                }
              >
                <Grid container className={"w-full"} spacing={2}>
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
                    <ActionButton
                      type={"submit"}
                      fullWidth
                      disabled={hasError}
                      loading={loading}
                    >
                      {countryModalData ? "UPDATE" : "ADD"}
                    </ActionButton>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
        </FormModal>
      ) : null}
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="country"
        ids={deleteTarget ? [deleteTarget.id] : []}
        name={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deleteAPI(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
