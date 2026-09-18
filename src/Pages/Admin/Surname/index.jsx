import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import CustomInput from "../../../Component/Common/customInput";
import {
  Button as ActionButton,
  FormModal,
  MasterFilterBar,
  PageHeader,
  searchFieldSx,
} from "../../../Component/UI";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly } from "../../../util/util";
import {
  getSurnameList,
  addSurname,
  updateSurname,
  deleteSurname,
} from "../../../util/surnameApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { getGotraAllList, addGotra } from "../../../util/gotraApi";

const gotraFilter = createFilterOptions();

const gotraNameOf = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return String(value.inputValue || value.name || value.label || "").trim();
};

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, auth } = UseRedux();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [surnameData, setSurnameData] = useState(null);
  const [surnameModalData, setSurnameModalData] = useState(null);
  const [surnameAddEditModel, setSurnameAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [gotraList, setGotraList] = useState([]);
  const [selectedGotra, setSelectedGotra] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const skipSearchEffect = useRef(true);
  const gotraOptions = useMemo(
    () =>
      (Array.isArray(gotraList) ? gotraList : [])
        .filter((item) => item?.active !== false)
        .map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        })),
    [gotraList]
  );
  const filterCount =
    Number(Boolean(selectedSearchByText.trim())) + Number(Boolean(selectedGotra));

  useEffect(() => {
    getGotraAllList()
      .then((data) => setGotraList(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setGotraList([]));
  }, []);

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
                setFieldValue("gotra", record?.row.gotra || "");
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
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const gotraName = gotraNameOf(values.gotra);
        const surnameName = String(values.name || "").trim();
        await completeModalMutation(dispatch, {
          mutate: async () => {
            const alreadyListed = gotraOptions.some(
              (item) =>
                String(item.name || "").trim().toLowerCase() ===
                gotraName.toLowerCase()
            );
            if (gotraName && !alreadyListed) {
              try {
                const created = await addGotra({ name: gotraName });
                setGotraList((prev) => {
                  const rows = Array.isArray(prev) ? prev : [];
                  if (
                    rows.some(
                      (item) =>
                        String(item.name || "").trim().toLowerCase() ===
                        gotraName.toLowerCase()
                    )
                  ) {
                    return rows;
                  }
                  return [...rows, created];
                });
              } catch (e) {
                setGotraList((prev) => [
                  ...(Array.isArray(prev) ? prev : []),
                  { id: `new-${Date.now()}`, name: gotraName, active: true },
                ]);
              }
            }
            const payload = { name: surnameName, gotra: gotraName };
            if (surnameModalData) {
              await updateSurname(surnameModalData.id, payload);
            } else {
              await addSurname(payload);
            }
          },
          refresh: () => handleSurnameList(),
          close: () => {
            resetForm();
            surnameAddEditModalClose();
          },
        });
      } catch (e) {
        // keep modal open if save fails
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Required"),
      gotra: Yup.string().trim().required("Required"),
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
    isSubmitting,
  } = formik;

  const surnameAddEditModalClose = () => {
    setSurnameAddEditModel(false);
    setSurnameModalData(null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteSurname(Array.isArray(id) ? id : [id]),
      refresh: () => handleSurnameList(),
    });
  };

  const hasError = Object.keys(errors)?.length || 0;

  const handleSurnameList = async (isRest = false) => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      if (!isRest && selectedSearchByText.trim()) {
        params.name = selectedSearchByText.trim();
      }
      if (!isRest && selectedGotra) {
        params.gotra = selectedGotra.name || selectedGotra.label;
      }
      const data = await getSurnameList(params);
      setSurnameData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  useEffect(() => {
    handleSurnameList();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      if (page !== 0) {
        setPage(0);
        return;
      }
      handleSurnameList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [selectedSearchByText, selectedGotra]);

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
            <div className="flex flex-col-reverse md:flex-row md:items-center gap-2 w-full md:w-auto max-md:[&>button]:w-full">
              <ActionButton
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/gotra")}
              >
                Gotra
              </ActionButton>
              {canManage ? (
                <ActionButton
                  icon={<AddIcon sx={{ fontSize: 18 }} />}
                  onClick={() => {
                    setSurnameModalData(null);
                    resetForm();
                    setSurnameAddEditModel(true);
                  }}
                >
                  Add Surname
                </ActionButton>
              ) : null}
            </div>
          }
        />
        <MasterFilterBar
          leading={
            <div className="w-[132px] sm:w-[180px] md:w-[220px]">
              <Autocomplete
                fullWidth
                options={gotraOptions}
                value={selectedGotra}
                onChange={(_, value) => setSelectedGotra(value)}
                getOptionLabel={(option) => option?.label || option?.name || ""}
                isOptionEqualToValue={(option, selected) =>
                  String(option?.id || option?.value) ===
                  String(selected?.id || selected?.value)
                }
                disablePortal
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Gotra"
                    sx={searchFieldSx}
                  />
                )}
              />
            </div>
          }
          searchPlaceholder="Search surname"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => setSelectedSearchByText(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => handleSurnameList()}
        />
        <div className={"hidden md:block w-full min-w-0"}>
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
            [row.gotra ? `Gotra: ${row.gotra}` : null].filter(Boolean)
          }
          activeDisabled={!canManage}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onEdit={
            canManage
              ? (row) => {
                  setSurnameModalData(row);
                  setSurnameAddEditModel(true);
                  setFieldValue("name", row.name);
                  setFieldValue("gotra", row.gotra || "");
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
                      <Autocomplete
                        freeSolo
                        selectOnFocus
                        clearOnBlur={false}
                        handleHomeEndKeys
                        options={gotraOptions}
                        value={values.gotra || null}
                        getOptionLabel={(option) => {
                          if (typeof option === "string") return option;
                          if (option?.inputValue) return option.inputValue;
                          return option?.name || option?.label || "";
                        }}
                        isOptionEqualToValue={(option, selected) => {
                          const left = gotraNameOf(option).toLowerCase();
                          const right = gotraNameOf(selected).toLowerCase();
                          return Boolean(left) && left === right;
                        }}
                        filterOptions={(options, params) => {
                          const filtered = gotraFilter(options, params);
                          const typed = String(params.inputValue || "").trim();
                          const exists = options.some(
                            (option) =>
                              gotraNameOf(option).toLowerCase() ===
                              typed.toLowerCase()
                          );
                          if (typed && !exists) {
                            filtered.push({
                              inputValue: typed,
                              name: typed,
                              label: typed,
                            });
                          }
                          return filtered;
                        }}
                        onChange={(_, newValue) => {
                          setFieldValue("gotra", gotraNameOf(newValue));
                        }}
                        onInputChange={(_, newInput, reason) => {
                          if (reason === "input") {
                            setFieldValue("gotra", newInput);
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id || option.inputValue || option.name}>
                            {option.inputValue
                              ? `Add "${option.inputValue}"`
                              : option.name || option.label}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="gotra"
                            label="Gotra"
                            onBlur={handleBlur}
                            error={Boolean(touched?.gotra && errors?.gotra)}
                            helperText={
                              touched?.gotra && errors?.gotra ? errors.gotra : ""
                            }
                            sx={searchFieldSx}
                          />
                        )}
                      />
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
                      loading={loading || isSubmitting}
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
