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
import { Form, FormikProvider, useFormik } from "formik";
import { Button as ActionButton, FilterActions, FormModal, MasterFilterBar, PageHeader } from "../../../Component/UI";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import BilingualInput from "../../../Component/Common/bilingualInput";
import MasterLangWrap from "../../../Component/Common/masterLangWrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
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
import { isLocationMasterReadOnly, isDistrictManager, isRegionManager, isStateManager, isCountryManager } from "../../../util/util";
import {
  getCityList,
  addCity,
  updateCity,
  deleteCity,
} from "../../../util/cityApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { fillMasterName, toNameEnGuPayload } from "../../../util/bhasha";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, country, state, region, district, auth } = UseRedux();
  const copy = useFilterCopy();
  const districtManager = isDistrictManager(auth?.user?.role);
  const regionManager = isRegionManager(auth?.user?.role);
  const stateManager = isStateManager(auth?.user?.role);
  const countryManager = isCountryManager(auth?.user?.role);
  const [ownDistrictList, setOwnDistrictList] = useState(false);
  const [ownRegionList, setOwnRegionList] = useState(false);
  const [ownStateList, setOwnStateList] = useState(false);
  const [ownCountryList, setOwnCountryList] = useState(false);
  const canAct = countryManager
    ? ownCountryList
    : stateManager
    ? ownStateList
    : regionManager
      ? ownRegionList
      : districtManager
        ? ownDistrictList
        : !isLocationMasterReadOnly(auth?.user?.role);
  const hideRowActions =
    (districtManager && !ownDistrictList) ||
    (regionManager && !ownRegionList) ||
    (stateManager && !ownStateList) ||
    (countryManager && !ownCountryList);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [cityData, setCityData] = useState(null);
  const [cityModalData, setCityModalData] = useState(null);
  const [cityAddEditModel, setCityAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCols = filterFieldCols(4);
  const filterCount =
    Number(Boolean(selectedSearchByText.trim())) +
    Number(Boolean(selectedCountry?.length > 0)) +
    Number(Boolean(selectedState?.length > 0)) +
    Number(Boolean(selectedRegion?.length > 0)) +
    Number(Boolean(selectedDistrict?.length > 0));

  useEffect(() => {
    handleCityList();
  }, [page, rowsPerPage, ownDistrictList, ownRegionList, ownStateList, ownCountryList]);

  const cityListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "samajCount",
      headerName: "Samaj",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => record?.row?.samajCount ?? 0,
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
                navigate(`/admin/city/${record?.row?.id}`, {
                  state: { ...record?.row, backTo: "/admin/city" },
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
                    setCityModalData(record?.row);
                    setCityAddEditModel(!cityAddEditModel);
                    fillMasterName(setFieldValue, record?.row);
                    setFieldValue("country_id", resolveMasterId(record?.row.country_id, country));
                    setFieldValue("state_id", resolveMasterId(record?.row.state_id, state));
                    setFieldValue("region_id", resolveMasterId(record?.row.region_id, region));
                    setFieldValue("district_id", resolveMasterId(record?.row.district_id, district));
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
      district_id: "",
      name: "",
      nameGu: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { confirmPassword, ...rest } = toNameEnGuPayload(values);
        await completeModalMutation(dispatch, {
          mutate: async () => {
            if (cityModalData) {
              await updateCity(cityModalData.id, {
                ...rest,
                updatedAt: new Date(),
              });
            } else {
              await addCity({ ...rest });
            }
          },
          refresh: () => handleCityList(),
          syncMasters: ["city"],
          close: () => {
            resetForm();
            cityAddEditModalClose();
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
  const districtOptions = useMemo(
    () => optionsByParent(district, "region_id", values.region_id, region),
    [district, values.region_id, region]
  );

  const cityAddEditModalClose = () => {
    setCityAddEditModel(!cityAddEditModel);
    setCityModalData(null);
    fillMasterName(setFieldValue, {});
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteCity(Array.isArray(id) ? id : [id]),
      refresh: () => handleCityList(),
      syncMasters: ["city"],
    });
  };

  const hasError = Object.keys(errors)?.length || 0;
  const filteredCountryIds = useFilteredIds(selectedCountry, "value", "label");
  const filteredStateIds = useFilteredIds(selectedState, "value", "label");
  const filteredRegionIds = useFilteredIds(selectedRegion, "value", "label");
  const filteredDistrictIds = useFilteredIds(
    selectedDistrict,
    "value",
    "label"
  );

  const handleCityList = async (isRest = false) => {
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
        district: isRest ? [] : filteredDistrictIds,
        ...text,
      };
      if (districtManager) {
        params.ownDistrict = ownDistrictList;
      }
      if (regionManager) {
        params.ownRegion = ownRegionList;
      }
      if (stateManager) {
        params.ownState = ownStateList;
      }
      if (countryManager) {
        params.ownCountry = ownCountryList;
      }
      const data = await getCityList(params);
      setCityData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedCountry([]);
    setSelectedState([]);
    setSelectedRegion([]);
    setSelectedDistrict([]);
    handleCityList(true);
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
      handleCityList();
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
          title="City"
          actions={
          <div className={"flex flex-col-reverse md:flex-row md:items-center items-stretch gap-2 md:gap-3 w-full md:w-auto"}>
            {districtManager || regionManager || stateManager || countryManager ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={
                      districtManager
                        ? ownDistrictList
                        : regionManager
                          ? ownRegionList
                          : stateManager
                            ? ownStateList
                            : ownCountryList
                    }
                    onChange={(e) => {
                      if (districtManager) {
                        setOwnDistrictList(e.target.checked);
                      } else if (regionManager) {
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
                    Your City
                  </span>
                }
              />
            ) : null}
            {canAct ? (
            <ActionButton
              className="max-md:w-full"
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setCityAddEditModel(!cityAddEditModel);
              }}
            >
              Add City
            </ActionButton>
            ) : null}
          </div>
          }
        />
        <MasterFilterBar
          searchPlaceholder={copy.searchCity}
          searchValue={selectedSearchByText}
          onSearchChange={(e) => {
            setSelectedSearchByText(e.target.value);
            if (e.target.value === "") {
              handleCityList(true);
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
                    setSelectedRegion([]);
                    setSelectedDistrict([]);
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
                    setSelectedRegion([]);
                    setSelectedDistrict([]);
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
                label={copy.region}
                placeholder={copy.regionPh}
                {...filterCols}
                value={selectedRegion}
                name="region"
                onChange={(e, regionItems) => {
                  if (regionItems) {
                    setSelectedRegion((pre) => getSelectedData(pre, regionItems, e));
                    setSelectedDistrict([]);
                  }
                }}
              />
              <CustomAutoComplete
                list={listHandler(
                  filterMastersByParents(district, "region_id", selectedRegion, {
                    parentList: region,
                  })
                )}
                multiple={true}
                label={copy.district}
                placeholder={copy.districtPh}
                {...filterCols}
                value={selectedDistrict}
                name="state"
                onChange={(e, districtItems) => {
                  if (districtItems) {
                    setSelectedDistrict((pre) =>
                      getSelectedData(pre, districtItems, e)
                    );
                  }
                }}
              />
              <Grid
                item
                xs={12}
                className={"flex justify-center items-center gap-4"}
              >
                <FilterActions
                  onSubmit={() => handleCityList()}
                  onReset={handleReset}
                  showReset={Boolean(selectedSearchByText || selectedCountry?.length > 0)}
                />
              </Grid>
            </Grid>
          }
        />
        <div className={"hidden md:block w-full min-w-0"}>
        <CustomTable
          columns={cityListColumn}
          data={cityData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="city"
        />
        </div>
        <MasterMobileCards
          rows={cityData?.data || []}
          emptyText="No cities"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canAct}
          getDetails={(row) => [`Samaj: ${row.samajCount ?? 0}`]}
          activeDisabled={!canAct}
          onView={
            hideRowActions
              ? undefined
              : (row) =>
                  navigate(`/admin/city/${row.id}`, {
                    state: { ...row, backTo: "/admin/city" },
                  })
          }
          onEdit={
            canAct
              ? (row) => {
                  setCityModalData(row);
                  setCityAddEditModel(true);
                  fillMasterName(setFieldValue, row);
                  setFieldValue("country_id", resolveMasterId(row.country_id, country));
                  setFieldValue("state_id", resolveMasterId(row.state_id, state));
                  setFieldValue("region_id", resolveMasterId(row.region_id, region));
                  setFieldValue("district_id", resolveMasterId(row.district_id, district));
                }
              : undefined
          }
          onDelete={canAct ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={cityData?.total || 0}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="city"
        />
      </ContainerPage>
      {cityAddEditModel ? (
        <FormModal
          open={cityAddEditModel}
          onClose={() => cityAddEditModalClose()}
          title="City"
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
                          setFieldValue("district_id", "");
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
                          setFieldValue("district_id", "");
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
                          setFieldValue("district_id", "");
                        }}
                        onBlur={handleBlur}
                        disabled={!values.state_id}
                      />
                      <CustomAutoComplete
                        list={districtOptions}
                        label={"District"}
                        placeholder={"Select Your District"}
                        name={"district_id"}
                        value={values.district_id}
                        errors={
                          touched?.district &&
                          errors?.district &&
                          errors?.district
                        }
                        onChange={(e, districtItem) => {
                          if (!districtItem) return;
                          setFieldValue("district_id", pickMasterId(districtItem));
                        }}
                        onBlur={handleBlur}
                        disabled={!values.region_id}
                      />
                      <BilingualInput
                        enName={"name"}
                        id="city"
                        label="City"
                        variant="outlined"
                        disabled={!values.district_id}
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
                      {cityModalData ? "UPDATE" : "ADD"}
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
        entity="city"
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
