import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import { Button as ActionButton, FormModal, MasterFilterBar, PageHeader, searchFieldSx } from "../../../Component/UI";
import BilingualInput from "../../../Component/Common/bilingualInput";
import MasterLangWrap from "../../../Component/Common/masterLangWrap";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { toMasterOptions, pickMasterId, resolveMasterId } from "../../../Component/constant";
import { isLocationMasterReadOnly, hideLocationRowActions, isCountryManager } from "../../../util/util";
import {
  getStateList,
  addState,
  updateState,
  deleteState,
} from "../../../util/stateApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { fillMasterName, toNameEnGuPayload } from "../../../util/bhasha";

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
  const [filterCountry, setFilterCountry] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [stateModalData, setStateModalData] = useState(null);
  const [stateAddEditModel, setStateAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const skipSearchEffect = useRef(true);
  const countryOptions = useMemo(() => toMasterOptions(country), [country]);
  const filterCount =
    Number(Boolean(selectedSearchByText.trim())) +
    Number(Boolean(filterCountry));

  useEffect(() => {
    handleStateList();
  }, [page, rowsPerPage, ownCountryList]);

  const stateListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "regionCount",
      headerName: "Regions",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => record?.row?.regionCount ?? 0,
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
          <CustomSwitch checked={record?.row?.active} disabled={!canAct} />
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
                    fillMasterName(setFieldValue, record?.row);
                    setFieldValue("country_id", resolveMasterId(record?.row.country_id, country));
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
      nameGu: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { confirmPassword, ...rest } = toNameEnGuPayload(values);
        await completeModalMutation(dispatch, {
          mutate: async () => {
            if (stateModalData) {
              await updateState(stateModalData.id, {
                ...rest,
                updatedAt: new Date(),
              });
            } else {
              await addState({ ...rest });
            }
          },
          refresh: () => handleStateList(),
          syncMasters: ["state"],
          close: () => {
            resetForm();
            stateAddEditModalClose();
          },
        });
      } catch (e) {
        // keep modal open if save fails
      }
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
    isSubmitting,
  } = formik;

  const stateAddEditModalClose = () => {
    setStateAddEditModel(false);
    setStateModalData(null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteState(Array.isArray(id) ? id : [id]),
      refresh: () => handleStateList(),
      syncMasters: ["state"],
    });
  };

  const hasError = Object.keys(errors)?.length || 0;
  const handleStateList = async (isRest = false) => {
    try {
      const text =
        selectedSearchByText && !isRest
          ? {
              name: selectedSearchByText,
            }
          : {};
      const countryId =
        !isRest && filterCountry
          ? filterCountry.id || filterCountry.value
          : null;
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        country: countryId ? [countryId] : [],
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
      handleStateList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [selectedSearchByText, filterCountry]);

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
          title="State"
          actions={
          <div className={"flex flex-col-reverse md:flex-row md:items-center items-stretch gap-2 md:gap-3 w-full md:w-auto"}>
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
                  <span className={"font-semibold text-primary"}>
                    Your State
                  </span>
                }
              />
            ) : null}
            {canAct ? (
            <ActionButton
              className="max-md:w-full"
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setStateModalData(null);
                resetForm();
                setStateAddEditModel(true);
              }}
            >
              Add State
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
                options={countryOptions}
                value={filterCountry}
                onChange={(_, value) => setFilterCountry(value)}
                getOptionLabel={(option) =>
                  option?.label ||
                  (typeof option?.name === "string" ? option.name : option?.name?.en) ||
                  ""
                }
                isOptionEqualToValue={(option, selected) =>
                  String(option?.id || option?.value) ===
                  String(selected?.id || selected?.value)
                }
                disablePortal
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Country"
                    sx={searchFieldSx}
                  />
                )}
              />
            </div>
          }
          searchPlaceholder="Search state"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => setSelectedSearchByText(e.target.value)}
          filterCount={filterCount}
          isFilterOpen={isFilterOpen}
          onFilterClick={() => handleStateList()}
        />
        <div className={"hidden md:block w-full min-w-0"}>
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
          deleteEntity="state"
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
                  fillMasterName(setFieldValue, row);
                  setFieldValue("country_id", resolveMasterId(row.country_id, country));
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
          deleteEntity="state"
        />
      </ContainerPage>
      {stateAddEditModel ? (
        <FormModal
          open={stateAddEditModel}
          onClose={() => stateAddEditModalClose()}
          title="State"
        >
            <MasterLangWrap>
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full pt-1 overflow-visible"
                }
              >
                <Grid container className={"w-full"} spacing={2}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full flex  gap-4"}>
                      <CustomAutoComplete
                        list={countryOptions}
                        label={"Country"}
                        placeholder={"Select Your Country"}
                        name={"country_id"}
                        value={values.country_id}
                        errors={
                          touched?.country && errors?.country && errors?.country
                        }
                        onSelect={handleChange}
                        onChange={(e, countryItem) => {
                          if (!countryItem) return;
                          setFieldValue("country_id", pickMasterId(countryItem));
                        }}
                        onBlur={handleBlur}
                      />
                      <BilingualInput
                        enName={"name"}
                        id="state"
                        label="State"
                        variant="outlined"
                        disabled={!values.country_id}
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
                      {stateModalData ? "UPDATE" : "ADD"}
                    </ActionButton>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
            </MasterLangWrap>
        </FormModal>
      ) : null}
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="state"
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
