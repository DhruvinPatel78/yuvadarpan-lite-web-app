import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTable from "../../../Component/Common/customTable";
import ContainerPage from "../../../Component/Container";
import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import {
  getListById,
  getSelectedData,
  handleListById,
  listHandler,
  useFilteredIds,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import {
  getCityList,
  addCity,
  updateCity,
  deleteCity,
} from "../../../util/cityApi";

export default function Index() {
  const dispatch = useDispatch();
  const { loading, country, state, region, district } = UseRedux();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = useState({
    country: [],
    state: [],
    region: [],
    district: [],
  });
  const [selectedValue, setSelectedValue] = useState({
    country: null,
    state: null,
    region: null,
    district: null,
  });
  const [cityData, setCityData] = useState(null);
  const [cityModalData, setCityModalData] = useState(null);
  const [cityAddEditModel, setCityAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [stateListByCountry, setStateListByCountry] = useState(state);
  const [regionListByState, setRegionListByState] = useState(region);
  const [districtListByRegion, setDistrictListByRegion] = useState(district);

  useEffect(() => {
    handleCityList();
  }, [page, rowsPerPage]);

  const cityListColumn = [
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
          <CustomSwitch checked={record?.row?.active} />
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
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => {
                setCityModalData(record?.row);
                setCityAddEditModel(!cityAddEditModel);
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
                }));
                setFieldValue("name", record?.row.name);
                setFieldValue("country_id", record?.row.country_id);
                setFieldValue("state_id", record?.row.state_id);
                setFieldValue("region_id", record?.row.region_id);
                setFieldValue("district_id", record?.row.district_id);
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

  const formik = useFormik({
    initialValues: {
      country_id: "",
      state_id: "",
      region_id: "",
      district_id: "",
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        if (cityModalData) {
          await updateCity(cityModalData.id, {
            ...rest,
            updatedAt: new Date(),
          });
        } else {
          await addCity({ ...rest });
        }
        cityAddEditModalClose();
        handleCityList();
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

  const cityAddEditModalClose = () => {
    setCityAddEditModel(!cityAddEditModel);
    setCityModalData(null);
    setFieldValue("name", null);
    setFieldValue("country_id", null);
    setFieldValue("state_id", null);
    setFieldValue("region_id", null);
    setFieldValue("district_id", null);
    setSelectedValue({
      country: null,
      state: null,
      region: null,
      district: null,
    });
    resetForm();
  };

  const deleteAPI = async (id) => {
    try {
      await deleteCity([id]);
      handleCityList();
    } catch (e) {
      // Optionally handle error with notification
    }
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
    setStateListByCountry(state);
    setRegionListByState(region);
    setDistrictListByRegion(district);
    handleCityList(true);
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <div className={"flex w-full items-center justify-between my-2"}>
          <p className={"text-3xl font-bold"}>City</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => {
              setCityAddEditModel(!cityAddEditModel);
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
            Add City
          </Button>
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
              name="state"
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
              placeholder={"Enter Search City"}
              name={"city"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => {
                setSelectedSearchByText(e.target.value);
                if (e.target.value === "") {
                  handleCityList(true);
                }
              }}
            />
            <Grid
              item
              xs={12}
              className={"flex justify-center items-center gap-4"}
            >
              <button
                className={"bg-primary text-white p-2 px-4 rounded font-bold"}
                onClick={() => handleCityList()}
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
        />
      </ContainerPage>
      {cityAddEditModel ? (
        <Modal
          open={cityAddEditModel}
          onClose={() => cityAddEditModalClose()}
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
              <span className={"text-2xl font-bold"}>City</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => cityAddEditModalClose()}
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
                        onChange={(e, district) => {
                          setFieldValue("district_id", district.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            district: district.name,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.region}
                      />
                      <CustomInput
                        name={"name"}
                        id="city"
                        label="City"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.district}
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
                        {cityModalData ? "UPDATE" : "ADD"}
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
