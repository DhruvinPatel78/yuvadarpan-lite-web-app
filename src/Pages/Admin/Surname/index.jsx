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
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import CustomInput from "../../../Component/Common/customInput";
import { Button as ActionButton, FormModal, PageHeader, FilterActions } from "../../../Component/UI";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly } from "../../../util/util";
import {
  getSurnameList,
  addSurname,
  updateSurname,
  deleteSurname,
} from "../../../util/surnameApi";

export default function Index() {
  const dispatch = useDispatch();
  const { loading, auth } = UseRedux();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [surnameData, setSurnameData] = useState(null);
  const [surnameModalData, setSurnameModalData] = useState(null);
  const [surnameAddEditModel, setSurnameAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    handleSurnameList();
  }, [page, rowsPerPage]);

  const surnameListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
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
              onClick={() => setDeleteTarget(record?.row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ].filter((column) => canManage || column.field !== "action");

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
      await deleteSurname(Array.isArray(id) ? id : [id]);
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
        <PageHeader
          className="w-full"
          title="Surname"
          actions={
            canManage ? (
              <ActionButton
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setSurnameAddEditModel(!surnameAddEditModel);
                }}
              >
                Add Surname
              </ActionButton>
            ) : null
          }
        />
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
              <FilterActions
                onSubmit={() => handleSurnameList()}
                onReset={handleReset}
                showReset={Boolean(selectedSearchByText)}
              />
            </Grid>
          </Grid>
        </CustomAccordion>
        <div className={"hidden md:block w-full"}>
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
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="surname"
        />
        </div>
        <MasterMobileCards
          rows={surnameData?.data || []}
          emptyText="No surnames"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canManage}
          getDetails={(row) =>
            [
              row.gotra ? `Gotra: ${row.gotra}` : null,
              row.mainBranch ? `Main Branch: ${row.mainBranch}` : null,
            ].filter(Boolean)
          }
          activeDisabled={!canManage}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onEdit={
            canManage
              ? (row) => {
                  setSurnameModalData(row);
                  setSurnameAddEditModel(true);
                  setFieldValue("name", row.name);
                  setFieldValue("gotra", row.gotra);
                  setFieldValue("mainBranch", row.mainBranch);
                }
              : undefined
          }
          onDelete={canManage ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={surnameData?.total || 0}
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="surname"
        />
      </ContainerPage>
      {surnameAddEditModel ? (
        <FormModal
          open={surnameAddEditModel}
          onClose={() => surnameAddEditModalClose()}
          title="Surname"
        >
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
                }
              >
                <Grid container className={"w-full"} spacing={2}>
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
                    <ActionButton
                      type={"submit"}
                      fullWidth
                      disabled={hasError}
                      loading={loading}
                    >
                      {surnameModalData ? "UPDATE" : "ADD"}
                    </ActionButton>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
        </FormModal>
      ) : null}
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="surname"
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
