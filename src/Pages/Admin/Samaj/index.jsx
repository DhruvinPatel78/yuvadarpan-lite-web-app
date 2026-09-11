import React, { useEffect, useState } from "react";
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
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import ContainerPage from "../../../Component/Container";
import { useDispatch } from "react-redux";
import { Form, FormikProvider, useFormik } from "formik";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import { Button as ActionButton, FormModal, PageHeader, FilterActions } from "../../../Component/UI";
import CustomInput from "../../../Component/Common/customInput";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import {
  getListById,
  getSelectedData,
  handleListById,
  listHandler,
  useFilteredIds,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import { isSamajManager, isCityManager, isDistrictManager, isRegionManager, isStateManager, isCountryManager } from "../../../util/util";
import {
  getSamajList,
  addSamaj,
  updateSamaj,
  deleteSamaj,
} from "../../../util/samajApi";

export default function Index() {
  const dispatch = useDispatch();
  const { loading, country, state, region, district, city, auth } = UseRedux();
  const samajManager = isSamajManager(auth?.user?.role);
  const cityManager = isCityManager(auth?.user?.role);
  const districtManager = isDistrictManager(auth?.user?.role);
  const regionManager = isRegionManager(auth?.user?.role);
  const stateManager = isStateManager(auth?.user?.role);
  const countryManager = isCountryManager(auth?.user?.role);
  const [ownCityList, setOwnCityList] = useState(false);
  const [ownDistrictList, setOwnDistrictList] = useState(false);
  const [ownRegionList, setOwnRegionList] = useState(false);
  const [ownStateList, setOwnStateList] = useState(false);
  const [ownCountryList, setOwnCountryList] = useState(false);
  const canAct = cityManager
    ? ownCityList
    : districtManager
      ? ownDistrictList
      : regionManager
        ? ownRegionList
        : stateManager
          ? ownStateList
          : countryManager
            ? ownCountryList
            : !samajManager;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = useState({
    country: [],
    state: [],
    region: [],
    district: [],
    city: [],
  });
  const [selectedValue, setSelectedValue] = useState({
    country: null,
    state: null,
    region: null,
    district: null,
    city: null,
  });
  const [samajData, setSamajData] = useState(null);
  const [samajModalData, setSamajModalData] = useState(null);
  const [samajAddEditModel, setSamajAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [stateListByCountry, setStateListByCountry] = useState(state);
  const [regionListByState, setRegionListByState] = useState(region);
  const [districtListByRegion, setDistrictListByRegion] = useState(district);

  useEffect(() => {
    handleSamajList();
  }, [page, rowsPerPage, ownCityList, ownDistrictList, ownRegionList, ownStateList, ownCountryList]);

  const samajColumn = [
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
            disabled={!canAct}
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
                setSamajModalData(record?.row);
                setSamajAddEditModel(!samajAddEditModel);
                setList((pre) => ({
                  ...pre,
                  country: country.map((data) => ({
                    ...data,
                    label: data.name,
                    value: data.id,
                  })),
                }));
                setSelectedValue((pre) => ({
                  ...pre,
                  country:
                    country.find((item) => item?.id === record?.row?.country_id)
                      ?.name ||
                    country.find(
                      (item) => item?.name === record?.row?.country_id
                    )?.name,
                  state: state.find(
                    (item) => item?.id === record?.row?.state_id
                  )?.name,
                  region: region.find(
                    (item) => item?.id === record?.row?.region_id
                  )?.name,
                  district: district.find(
                    (item) => item?.id === record?.row?.district_id
                  )?.name,
                  city: city.find((item) => item?.id === record?.row?.city_id)
                    ?.name,
                }));
                setFieldValue("name", record?.row.name);
                setFieldValue("label", record?.row.label);
                setFieldValue("zipcode", record?.row.zipcode);
                setFieldValue("country_id", record?.row.country_id);
                setFieldValue("state_id", record?.row.state_id);
                setFieldValue("region_id", record?.row.region_id);
                setFieldValue("district_id", record?.row.district_id);
                setFieldValue("city_id", record?.row.city_id);
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
  ].filter((column) => canAct || column.field !== "action");

  const formik = useFormik({
    initialValues: {
      country_id: "",
      state_id: "",
      region_id: "",
      district_id: "",
      city_id: "",
      name: "",
      label: "",
      zipcode: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        if (samajModalData) {
          await updateSamaj(samajModalData.id, {
            ...rest,
            updatedAt: new Date(),
          });
        } else {
          await addSamaj({ ...rest });
        }
        samajAddEditModalClose();
        handleSamajList();
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

  const samajAddEditModalClose = () => {
    setSamajAddEditModel(!samajAddEditModel);
    setSamajModalData(null);
    setFieldValue("name", null);
    setFieldValue("country_id", null);
    setFieldValue("state_id", null);
    setFieldValue("region_id", null);
    setFieldValue("district_id", null);
    setFieldValue("samaj_id", null);
    setSelectedValue({
      country: null,
      state: null,
      region: null,
      district: null,
      samaj: null,
    });
    resetForm();
  };

  const deleteAPI = async (id) => {
    try {
      await deleteSamaj(Array.isArray(id) ? id : [id]);
      handleSamajList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const hasError = Object.keys(errors)?.length || 0;
  const filteredCountryIds = useFilteredIds(selectedCountry, "value", "label");
  const filteredStateIds = useFilteredIds(selectedState, "value", "label");
  const filteredRegionIds = useFilteredIds(selectedRegion, "value", "label");
  const filteredCityIds = useFilteredIds(selectedCity, "value", "label");
  const filteredDistrictIds = useFilteredIds(
    selectedDistrict,
    "value",
    "label"
  );

  const handleSamajList = async (isRest = false) => {
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
        city: isRest ? [] : filteredCityIds,
        ...text,
      };
      if (cityManager) {
        params.ownCity = ownCityList;
      }
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
      const data = await getSamajList(params);
      setSamajData(data);
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
    setSelectedCity([]);
    setStateListByCountry(state);
    setRegionListByState(region);
    setDistrictListByRegion(district);
    handleSamajList(true);
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
          title="Samaj"
          actions={
          <div className={"flex flex-col-reverse md:flex-row md:items-center items-stretch gap-2 md:gap-3 w-full md:w-auto"}>
            {cityManager || districtManager || regionManager || stateManager || countryManager ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={
                      cityManager
                        ? ownCityList
                        : districtManager
                          ? ownDistrictList
                          : regionManager
                            ? ownRegionList
                            : stateManager
                              ? ownStateList
                              : ownCountryList
                    }
                    onChange={(e) => {
                      if (cityManager) {
                        setOwnCityList(e.target.checked);
                      } else if (districtManager) {
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
                    Your Samaj
                  </span>
                }
              />
            ) : null}
            {canAct ? (
            <ActionButton
              className="max-md:w-full"
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setSamajAddEditModel(!samajAddEditModel);
                setList((pre) => ({
                  ...pre,
                  country: country.map((data) => ({
                    ...data,
                    label: data.name,
                    value: data.id,
                  })),
                }));
              }}
            >
              Add Samaj
            </ActionButton>
            ) : null}
          </div>
          }
        />
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
              onChange={async (e, country) => {
                if (country) {
                  const data = await handleListById("state", country);
                  setStateListByCountry(data);
                  setSelectedCountry((pre) => getSelectedData(pre, country, e));
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(stateListByCountry)}
              multiple={true}
              label={"State"}
              placeholder={"Select Your State"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedState}
              name="state"
              onChange={async (e, state) => {
                if (state) {
                  const data = await handleListById("region", state);
                  setRegionListByState(data);
                  setSelectedState((pre) => getSelectedData(pre, state, e));
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(regionListByState)}
              multiple={true}
              label={"Region"}
              placeholder={"Select Your Region"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedRegion}
              name="region"
              onChange={async (e, region) => {
                if (region) {
                  const data = await handleListById("district", region);
                  setDistrictListByRegion(data);
                  setSelectedRegion((pre) => getSelectedData(pre, region, e));
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(districtListByRegion)}
              multiple={true}
              label={"District"}
              placeholder={"Select Your District"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedDistrict}
              name="district"
              onChange={(e, district) => {
                if (district) {
                  setSelectedDistrict((pre) =>
                    getSelectedData(pre, district, e)
                  );
                }
              }}
            />
            <CustomInput
              type={"text"}
              placeholder={"Enter Search Samaj"}
              name={"samaj"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => {
                setSelectedSearchByText(e.target.value);
                if (e.target.value === "") {
                  handleSamajList(true);
                }
              }}
            />
            <Grid
              item
              xs={12}
              className={"flex justify-center items-center gap-4"}
            >
              <FilterActions
                onSubmit={() => handleSamajList()}
                onReset={handleReset}
                showReset={Boolean(selectedSearchByText || selectedCountry?.length > 0)}
              />
            </Grid>
          </Grid>
        </CustomAccordion>
        <div className={"hidden md:block w-full"}>
        <CustomTable
          columns={samajColumn}
          data={samajData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="samaj"
        />
        </div>
        <MasterMobileCards
          rows={samajData?.data || []}
          emptyText="No samaj"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canAct}
          getDetails={(row) =>
            [
              city.find((item) => item?.id === row?.city_id)?.name
                ? `City: ${city.find((item) => item?.id === row?.city_id)?.name}`
                : null,
              row.zipcode ? `Zipcode: ${row.zipcode}` : null,
            ].filter(Boolean)
          }
          activeDisabled={!canAct}
          onEdit={
            canAct
              ? (row) => {
                  setSamajModalData(row);
                  setSamajAddEditModel(true);
                  setList((pre) => ({
                    ...pre,
                    country: country.map((data) => ({
                      ...data,
                      label: data.name,
                      value: data.id,
                    })),
                  }));
                  setSelectedValue((pre) => ({
                    ...pre,
                    country:
                      country.find((item) => item?.id === row?.country_id)?.name ||
                      country.find((item) => item?.name === row?.country_id)?.name,
                    state: state.find((item) => item?.id === row?.state_id)?.name,
                    region: region.find((item) => item?.id === row?.region_id)
                      ?.name,
                    district: district.find(
                      (item) => item?.id === row?.district_id
                    )?.name,
                    city: city.find((item) => item?.id === row?.city_id)?.name,
                  }));
                  setFieldValue("name", row.name);
                  setFieldValue("label", row.label);
                  setFieldValue("zipcode", row.zipcode);
                  setFieldValue("country_id", row.country_id);
                  setFieldValue("state_id", row.state_id);
                  setFieldValue("region_id", row.region_id);
                  setFieldValue("district_id", row.district_id);
                  setFieldValue("city_id", row.city_id);
                }
              : undefined
          }
          onDelete={canAct ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={samajData?.total || 0}
          onDeleteSelected={canAct ? deleteAPI : undefined}
          deleteEntity="samaj"
        />
      </ContainerPage>
      {samajAddEditModel ? (
        <FormModal
          open={samajAddEditModel}
          onClose={() => samajAddEditModalClose()}
          title="Samaj"
        >
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
                }
              >
                <Grid container className={"w-full"} spacing={2}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full flex  gap-4"}>
                      <CustomAutoComplete
                        list={list.country}
                        label={"Country"}
                        placeholder={"Select Your Country"}
                        name={"country_id"}
                        value={selectedValue.country}
                        errors={
                          touched?.country && errors?.country && errors?.country
                        }
                        onSelect={handleChange}
                        onChange={async (e, country) => {
                          await setFieldValue("country_id", country.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            country: country.name,
                            state: null,
                            region: null,
                            district: null,
                            city: null,
                          }));
                          const data = await getListById("state", country.id);
                          setList((pre) => ({
                            ...pre,
                            state: data,
                          }));
                        }}
                        onBlur={handleBlur}
                      />
                      <CustomAutoComplete
                        list={list.state}
                        label={"State"}
                        placeholder={"Select Your State"}
                        name={"state_id"}
                        value={selectedValue.state}
                        errors={
                          touched?.state && errors?.state && errors?.state
                        }
                        onChange={async (e, state) => {
                          await setFieldValue("state_id", state.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            state: state.name,
                            region: null,
                            district: null,
                            city: null,
                          }));
                          const data = await getListById("region", state.id);
                          setList((pre) => ({
                            ...pre,
                            region: data,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.country}
                      />
                      <CustomAutoComplete
                        list={list.region}
                        label={"Region"}
                        placeholder={"Select Your Region"}
                        name={"region_id"}
                        value={selectedValue.region}
                        errors={
                          touched?.region && errors?.region && errors?.region
                        }
                        onChange={async (e, region) => {
                          await setFieldValue("region_id", region.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            region: region.name,
                            district: null,
                            city: null,
                          }));
                          const data = await getListById("district", region.id);
                          setList((pre) => ({
                            ...pre,
                            district: data,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.state}
                      />
                      <CustomAutoComplete
                        list={list.district}
                        label={"District"}
                        placeholder={"Select Your District"}
                        name={"district_id"}
                        value={selectedValue.district}
                        errors={
                          touched?.district &&
                          errors?.district &&
                          errors?.district
                        }
                        onChange={async (e, district) => {
                          await setFieldValue("district_id", district.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            district: district.name,
                            city: null,
                          }));
                          const data = await getListById("city", district.id);
                          setList((pre) => ({
                            ...pre,
                            city: data,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.region}
                      />
                      <CustomAutoComplete
                        list={list.city}
                        label={"City"}
                        placeholder={"Select Your City"}
                        name={"city_id"}
                        value={selectedValue.city}
                        errors={touched?.city && errors?.city && errors?.city}
                        onChange={(e, city) => {
                          setFieldValue("city_id", city.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            city: city.name,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.district}
                      />
                      <CustomInput
                        name={"name"}
                        id="samaj"
                        label="Samaj"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.city}
                        onBlur={handleBlur}
                        errors={touched?.name && errors?.name && errors?.name}
                      />
                      <CustomInput
                        name={"label"}
                        id="samajLabel"
                        label="Samaj Label"
                        value={values.label}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.city}
                        onBlur={handleBlur}
                        errors={
                          touched?.label && errors?.label && errors?.label
                        }
                      />
                      <CustomInput
                        name={"zipcode"}
                        id="samajZipcode"
                        label="Zipcode"
                        value={values.zipcode}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.city}
                        onBlur={handleBlur}
                        errors={
                          touched?.zipcode && errors?.zipcode && errors?.zipcode
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
                      {samajModalData ? "UPDATE" : "ADD"}
                    </ActionButton>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
        </FormModal>
      ) : null}
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="samaj"
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
