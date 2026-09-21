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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import BilingualInput from "../../../Component/Common/bilingualInput";
import MasterLangWrap from "../../../Component/Common/masterLangWrap";
import { Button as ActionButton, FilterActions, FormModal, MasterFilterBar, PageHeader } from "../../../Component/UI";
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
import { isLocationMasterReadOnly, isRegionManager, isCityManager, isDistrictManager, isStateManager, isCountryManager } from "../../../util/util";
import {
  getDistrictList,
  addDistrict,
  updateDistrict,
  deleteDistrict,
} from "../../../util/districtApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { fillMasterName, toNameEnGuPayload } from "../../../util/bhasha";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, country, state, region, auth } = UseRedux();
  const regionManager = isRegionManager(auth?.user?.role);
  const stateManager = isStateManager(auth?.user?.role);
  const countryManager = isCountryManager(auth?.user?.role);
  const [ownRegionList, setOwnRegionList] = useState(false);
  const [ownStateList, setOwnStateList] = useState(false);
  const [ownCountryList, setOwnCountryList] = useState(false);
  const canAct = countryManager
    ? ownCountryList
    : stateManager
    ? ownStateList
    : regionManager
      ? ownRegionList
      : !isLocationMasterReadOnly(auth?.user?.role);
  const hideRowActions =
    isCityManager(auth?.user?.role) ||
    isDistrictManager(auth?.user?.role) ||
    (regionManager && !ownRegionList) ||
    (stateManager && !ownStateList) ||
    (countryManager && !ownCountryList);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [districtData, setDistrictData] = useState(null);
  const [districtModalData, setDistrictModalData] = useState(null);
  const [districtAddEditModel, setDistrictAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCols = filterFieldCols(3);
  const filterCount =
    Number(Boolean(selectedSearchByText.trim())) +
    Number(Boolean(selectedCountry?.length > 0)) +
    Number(Boolean(selectedState?.length > 0)) +
    Number(Boolean(selectedRegion?.length > 0));

  useEffect(() => {
    handleDistrictList();
  }, [page, rowsPerPage, ownRegionList, ownStateList, ownCountryList]);

  const districtListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "cityCount",
      headerName: "Cities",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => record?.row?.cityCount ?? 0,
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
                navigate(`/admin/district/${record?.row?.id}`, {
                  state: { ...record?.row, backTo: "/admin/district" },
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
                    setDistrictModalData(record?.row);
                    setDistrictAddEditModel(!districtAddEditModel);
                    fillMasterName(setFieldValue, record?.row);
                    setFieldValue("country_id", resolveMasterId(record?.row.country_id, country));
                    setFieldValue("state_id", resolveMasterId(record?.row.state_id, state));
                    setFieldValue("region_id", resolveMasterId(record?.row.region_id, region));
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
      region_id: "",
      name: "",
      nameGu: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { confirmPassword, ...rest } = toNameEnGuPayload(values);
        await completeModalMutation(dispatch, {
          mutate: async () => {
            if (districtModalData) {
              await updateDistrict(districtModalData.id, {
                ...rest,
                updatedAt: new Date(),
              });
            } else {
              await addDistrict({ ...rest });
            }
          },
          refresh: () => handleDistrictList(),
          close: () => {
            resetForm();
            districtAddEditModalClose();
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
  const regionOptions = useMemo(
    () => optionsByParent(region, "state_id", values.state_id, state),
    [region, values.state_id, state]
  );

  const districtAddEditModalClose = () => {
    setDistrictAddEditModel(!districtAddEditModel);
    setDistrictModalData(null);
    fillMasterName(setFieldValue, {});
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteDistrict(Array.isArray(id) ? id : [id]),
      refresh: () => handleDistrictList(),
    });
  };

  const hasError = Object.keys(errors)?.length || 0;
  const filteredCountryIds = useFilteredIds(selectedCountry, "value", "label");
  const filteredStateIds = useFilteredIds(selectedState, "value", "label");
  const filteredRegionIds = useFilteredIds(selectedRegion, "value", "label");

  const handleDistrictList = async (isRest = false) => {
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
        region: isRest ? [] : filteredRegionIds,
        ...text,
      };
      if (regionManager) {
        params.ownRegion = ownRegionList;
      }
      if (stateManager) {
        params.ownState = ownStateList;
      }
      if (countryManager) {
        params.ownCountry = ownCountryList;
      }
      const data = await getDistrictList(params);
      setDistrictData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedCountry([]);
    setSelectedState([]);
    setSelectedRegion([]);
    handleDistrictList(true);
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
      handleDistrictList();
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
          title="District"
          actions={
          <div className={"flex flex-col-reverse md:flex-row md:items-center items-stretch gap-2 md:gap-3 w-full md:w-auto"}>
            {regionManager || stateManager || countryManager ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={
                      regionManager
                        ? ownRegionList
                        : stateManager
                          ? ownStateList
                          : ownCountryList
                    }
                    onChange={(e) => {
                      if (regionManager) {
                        setOwnRegionList(e.target.checked);
                      } else if (stateManager) {
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
                    Your District
                  </span>
                }
              />
            ) : null}
            {canAct ? (
            <ActionButton
              className="max-md:w-full"
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setDistrictAddEditModel(!districtAddEditModel);
              }}
            >
              Add District
            </ActionButton>
            ) : null}
          </div>
          }
        />
        <MasterFilterBar
          searchPlaceholder="Search district"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => {
            setSelectedSearchByText(e.target.value);
            if (e.target.value === "") {
              handleDistrictList(true);
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
                label={"Country"}
                placeholder={"Select Your Country"}
                {...filterCols}
                value={selectedCountry}
                name="country"
                onChange={(e, countryItems) => {
                  if (countryItems) {
                    setSelectedCountry((pre) => getSelectedData(pre, countryItems, e));
                    setSelectedState([]);
                    setSelectedRegion([]);
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
                label={"State"}
                placeholder={"Select Your State"}
                {...filterCols}
                value={selectedState}
                name="state"
                onChange={(e, stateItems) => {
                  if (stateItems) {
                    setSelectedState((pre) => getSelectedData(pre, stateItems, e));
                    setSelectedRegion([]);
                  }
                }}
              />
              <CustomAutoComplete
                list={listHandler(
                  filterMastersByParents(region, "state_id", selectedState, {
                    parentList: state,
                  })
                )}
                multiple={true}
                label={"Region"}
                placeholder={"Select Your Region"}
                {...filterCols}
                value={selectedRegion}
                name="state"
                onChange={(e, regionItems) => {
                  if (regionItems) {
                    setSelectedRegion((pre) => getSelectedData(pre, regionItems, e));
                  }
                }}
              />
              <Grid
                item
                xs={12}
                className={"flex justify-center items-center gap-4"}
              >
                <FilterActions
                  onSubmit={() => handleDistrictList()}
                  onReset={handleReset}
                  showReset={Boolean(selectedSearchByText || selectedCountry?.length > 0)}
                />
              </Grid>
            </Grid>
          }
        />
        <div className={"hidden md:block w-full min-w-0"}>
        <CustomTable
          columns={districtListColumn}
          data={districtData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="district"
        />
        </div>
        <MasterMobileCards
          rows={districtData?.data || []}
          emptyText="No districts"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canAct}
          getDetails={(row) => [`Cities: ${row.cityCount ?? 0}`]}
          activeDisabled={!canAct}
          onView={
            hideRowActions
              ? undefined
              : (row) =>
                  navigate(`/admin/district/${row.id}`, {
                    state: { ...row, backTo: "/admin/district" },
                  })
          }
          onEdit={
            canAct
              ? (row) => {
                  setDistrictModalData(row);
                  setDistrictAddEditModel(true);
                  fillMasterName(setFieldValue, row);
                  setFieldValue("country_id", resolveMasterId(row.country_id, country));
                  setFieldValue("state_id", resolveMasterId(row.state_id, state));
                  setFieldValue("region_id", resolveMasterId(row.region_id, region));
                }
              : undefined
          }
          onDelete={canAct ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={districtData?.total || 0}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="district"
        />
      </ContainerPage>
      {districtAddEditModel ? (
        <FormModal
          open={districtAddEditModel}
          onClose={() => districtAddEditModalClose()}
          title="District"
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
                          setFieldValue("state_id", "");
                          setFieldValue("region_id", "");
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
                          setFieldValue("region_id", "");
                        }}
                        onBlur={handleBlur}
                        disabled={!values.country_id}
                      />
                      <CustomAutoComplete
                        list={regionOptions}
                        label={"Region"}
                        placeholder={"Select Your Region"}
                        name={"region_id"}
                        value={values.region_id}
                        errors={
                          touched?.region && errors?.region && errors?.region
                        }
                        onChange={(e, regionItem) => {
                          if (!regionItem) return;
                          setFieldValue("region_id", pickMasterId(regionItem));
                        }}
                        onBlur={handleBlur}
                        disabled={!values.state_id}
                      />
                      <BilingualInput
                        enName={"name"}
                        id="district"
                        label="District"
                        variant="outlined"
                        disabled={!values.region_id}
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
                      {districtModalData ? "UPDATE" : "ADD"}
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
        entity="district"
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
