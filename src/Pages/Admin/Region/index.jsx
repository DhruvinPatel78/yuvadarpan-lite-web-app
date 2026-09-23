import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Tooltip,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import ContainerPage from "../../../Component/Container";
import AddIcon from "@mui/icons-material/Add";
import { Form, FormikProvider, useFormik } from "formik";
import { Button as ActionButton, FilterActions, FormModal, MasterFilterBar, PageHeader } from "../../../Component/UI";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import BilingualInput from "../../../Component/Common/bilingualInput";
import MasterLangWrap from "../../../Component/Common/masterLangWrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import {
  getSelectedData,
  filterFieldCols,
  filterMastersByParents,
  listHandler,
  optionsByParent,
  toMasterOptions,
  pickMasterId,
  resolveMasterId,
  useFilteredIds,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import { useFilterCopy } from "../../../i18n/useFilterCopy";
import { isLocationMasterReadOnly, isStateManager, isCityManager, isDistrictManager, isRegionManager, isCountryManager } from "../../../util/util";
import {
  getRegionList,
  addRegion,
  updateRegion,
  deleteRegion,
} from "../../../util/regionApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { fillMasterName, toNameEnGuPayload } from "../../../util/bhasha";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, country, state, auth } = UseRedux();
  const copy = useFilterCopy();
  const stateManager = isStateManager(auth?.user?.role);
  const countryManager = isCountryManager(auth?.user?.role);
  const [ownStateList, setOwnStateList] = useState(false);
  const [ownCountryList, setOwnCountryList] = useState(false);
  const canAct = countryManager
    ? ownCountryList
    : stateManager
    ? ownStateList
    : !isLocationMasterReadOnly(auth?.user?.role);
  const hideRowActions =
    isCityManager(auth?.user?.role) ||
    isDistrictManager(auth?.user?.role) ||
    isRegionManager(auth?.user?.role) ||
    (stateManager && !ownStateList) ||
    (countryManager && !ownCountryList);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [regionData, setRegionData] = useState(null);
  const [regionModalData, setRegionModalData] = useState(null);
  const [regionAddEditModel, setRegionAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCols = filterFieldCols(2);
  const filterCount =
    Number(Boolean(selectedSearchByText.trim())) +
    Number(Boolean(selectedCountry?.length > 0)) +
    Number(Boolean(selectedState?.length > 0));

  useEffect(() => {
    handleRegionList();
  }, [page, rowsPerPage, ownStateList, ownCountryList]);

  const regionListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "districtCount",
      headerName: "Districts",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => record?.row?.districtCount ?? 0,
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
                navigate(`/admin/region/${record?.row?.id}`, {
                  state: { ...record?.row, backTo: "/admin/region" },
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
                    setRegionModalData(record?.row);
                    setRegionAddEditModel(!regionAddEditModel);
                    setFieldValue("country_id", resolveMasterId(record?.row?.country_id, country));
                    setFieldValue("state_id", resolveMasterId(record?.row?.state_id, state));
                    fillMasterName(setFieldValue, record?.row);
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
      state_id: "",
      name: "",
      nameGu: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { confirmPassword, ...rest } = toNameEnGuPayload(values);
        await completeModalMutation(dispatch, {
          mutate: async () => {
            if (regionModalData) {
              await updateRegion(regionModalData.id, {
                ...rest,
                updatedAt: new Date(),
              });
            } else {
              await addRegion({ ...rest });
            }
          },
          refresh: () => handleRegionList(),
          syncMasters: ["region"],
          close: () => {
            resetForm();
            regionAddEditModalClose();
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
  const countryOptions = useMemo(() => toMasterOptions(country), [country]);
  const stateOptions = useMemo(
    () => optionsByParent(state, "country_id", values.country_id, country),
    [state, values.country_id, country]
  );

  const regionAddEditModalClose = () => {
    setRegionAddEditModel(!regionAddEditModel);
    setRegionModalData(null);
    fillMasterName(setFieldValue, {});
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteRegion(Array.isArray(id) ? id : [id]),
      refresh: () => handleRegionList(),
      syncMasters: ["region"],
    });
  };

  const hasError = Object.keys(errors)?.length || 0;
  const filteredCountryIds = useFilteredIds(selectedCountry, "value", "label");
  const filteredStateIds = useFilteredIds(selectedState, "value", "label");

  const handleRegionList = async (isRest = false) => {
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
        state: isRest ? [] : filteredStateIds,
        ...text,
      };
      if (stateManager) {
        params.ownState = ownStateList;
      }
      if (countryManager) {
        params.ownCountry = ownCountryList;
      }
      const data = await getRegionList(params);
      setRegionData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedCountry([]);
    setSelectedState([]);
    handleRegionList(true);
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
      handleRegionList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [selectedSearchByText]);

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
          title="Region"
          actions={
          <div className={"flex flex-col-reverse md:flex-row md:items-center items-stretch gap-2 md:gap-3 w-full md:w-auto"}>
            {stateManager || countryManager ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={stateManager ? ownStateList : ownCountryList}
                    onChange={(e) => {
                      if (stateManager) {
                        setOwnStateList(e.target.checked);
                      } else {
                        setOwnCountryList(e.target.checked);
                      }
                      setPage(0);
                    }}
                  />
                }
                label={
                  <span className={"font-semibold text-primary"}>
                    Your Region
                  </span>
                }
              />
            ) : null}
            {canAct ? (
            <ActionButton
              className="max-md:w-full"
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setRegionAddEditModel(!regionAddEditModel);
              }}
            >
              Add Region
            </ActionButton>
            ) : null}
          </div>
          }
        />
        <MasterFilterBar
          searchPlaceholder={copy.searchRegion}
          searchValue={selectedSearchByText}
          onSearchChange={(e) => {
            setSelectedSearchByText(e.target.value);
            if (e.target.value === "") {
              handleRegionList(true);
            }
          }}
          filterCount={filterCount}
          isFilterOpen={isFilterOpen}
          onFilterClick={() => setIsFilterOpen((open) => !open)}
          extraFilters={
            <Grid spacing={2} container>
              <CustomAutoComplete
                list={listHandler(country)}
                multiple={true}
                label={copy.country}
                placeholder={copy.countryPh}
                {...filterCols}
                value={selectedCountry}
                name="country"
                onChange={(e, countryItems) => {
                  if (countryItems) {
                    setSelectedCountry((pre) => getSelectedData(pre, countryItems, e));
                    setSelectedState([]);
                  }
                }}
              />
              <CustomAutoComplete
                list={listHandler(
                  filterMastersByParents(state, "country_id", selectedCountry, {
                    parentList: country,
                  })
                )}
                multiple={true}
                label={copy.state}
                placeholder={copy.statePh}
                {...filterCols}
                value={selectedState}
                name="state"
                onChange={(e, stateItems) => {
                  if (stateItems) {
                    setSelectedState((pre) => getSelectedData(pre, stateItems, e));
                  }
                }}
              />
              <Grid
                item
                xs={12}
                className={"flex justify-start items-center gap-4"}
              >
                <FilterActions
                  onSubmit={() => handleRegionList()}
                  onReset={handleReset}
                  showReset={Boolean(selectedSearchByText || selectedCountry?.length > 0)}
                />
              </Grid>
            </Grid>
          }
        />
        <div className={"hidden md:block w-full min-w-0"}>
        <CustomTable
          columns={regionListColumn}
          data={regionData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="region"
        />
        </div>
        <MasterMobileCards
          rows={regionData?.data || []}
          emptyText="No regions"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canAct}
          getDetails={(row) => [`Districts: ${row.districtCount ?? 0}`]}
          activeDisabled={!canAct}
          onView={
            hideRowActions
              ? undefined
              : (row) =>
                  navigate(`/admin/region/${row.id}`, {
                    state: { ...row, backTo: "/admin/region" },
                  })
          }
          onEdit={
            canAct
              ? (row) => {
                  setRegionModalData(row);
                  setRegionAddEditModel(true);
                  setFieldValue("country_id", resolveMasterId(row?.country_id, country));
                  setFieldValue("state_id", resolveMasterId(row?.state_id, state));
                  fillMasterName(setFieldValue, row);
                }
              : undefined
          }
          onDelete={canAct ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={regionData?.total || 0}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="region"
        />
      </ContainerPage>
      {regionAddEditModel ? (
        <FormModal
          open={regionAddEditModel}
          onClose={() => regionAddEditModalClose()}
          title="Region"
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
                    <FormControl className={"w-full flex gap-4"}>
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
                          setFieldValue("state_id", "");
                        }}
                        onBlur={handleBlur}
                      />
                      <CustomAutoComplete
                        list={stateOptions}
                        label={"State"}
                        placeholder={"Select Your State"}
                        name={"state_id"}
                        value={values.state_id}
                        errors={
                          touched?.state && errors?.state && errors?.state
                        }
                        onChange={(e, stateItem) => {
                          if (!stateItem) return;
                          setFieldValue("state_id", pickMasterId(stateItem));
                        }}
                        onBlur={handleBlur}
                        disabled={!values.country_id}
                      />
                      <BilingualInput
                        enName={"name"}
                        id="region"
                        label="Region"
                        variant="outlined"
                        disabled={!values.state_id}
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
                      {regionModalData ? "UPDATE" : "ADD"}
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
        entity="region"
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
